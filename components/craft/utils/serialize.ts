export const convertToHtml = (nodes: any): string => {
    const renderNode = (nodeId: string): string => {
        const node = nodes[nodeId];
        if (!node || !node.data || !node.data.type) return '';

        const data = node.data;
        const resolvedName = typeof data.type === 'string' ? data.type : data.type.resolvedName;
        if (!resolvedName) return '';
        
        const props = data.props || {};
        const children = (data.nodes || []).map((id: string) => renderNode(id)).join('');

        switch (resolvedName) {
            case 'Container': {
                const styles = [
                    props.background && props.background !== 'transparent' ? `background: ${props.background}` : '',
                    props.padding ? `padding: ${props.padding}px` : '',
                    'display: flex',
                    `flex-direction: ${props.flexDirection || 'column'}`,
                    `align-items: ${props.alignItems || 'flex-start'}`,
                    `justify-content: ${props.justifyContent || 'flex-start'}`,
                    'width: 100%'
                ].filter(Boolean).join('; ');

                return `<div style="${styles}">${children}</div>`;
            }
            case 'Text': {
                const tagName = props.tagName || 'p';
                const styles = [
                    props.fontSize ? `font-size: ${props.fontSize}px` : '',
                    props.textAlign ? `text-align: ${props.textAlign}` : '',
                    props.fontWeight ? `font-weight: ${props.fontWeight}` : '',
                    props.color ? `color: ${props.color}` : '',
                    'margin: 0'
                ].filter(Boolean).join('; ');

                return `<div style="padding: 4px"><${tagName} style="${styles}">${props.text || ''}</${tagName}></div>`;
            }
            case 'Button': {
                const styles = 'display: inline-block; padding: 8px 16px; background: #3b82f6; color: white; border-radius: 6px; text-decoration: none; font-size: 14px;';
                return `<div style="display: inline-block"><a href="${props.href || '#'}" target="_blank" style="${styles}">${props.text || 'Button'}</a></div>`;
            }
            case 'Image': {
                const styles = [
                    `width: ${typeof props.width === 'number' ? `${props.width}px` : props.width || '100%'}`,
                    `height: ${typeof props.height === 'number' ? `${props.height}px` : props.height || 'auto'}`,
                    `object-fit: ${props.objectFit || 'cover'}`,
                    `border-radius: ${props.borderRadius || 0}px`,
                    'display: block',
                    'max-width: 100%'
                ].filter(Boolean).join('; ');

                return `<div style="display: inline-block; width: 100%"><img src="${props.src || ''}" alt="${props.alt || ''}" style="${styles}" /></div>`;
            }
            case 'Video': {
                const styles = `border-radius: ${props.borderRadius || 0}px; display: block; background: #000;`;
                return `
                    <div style="width: 100%">
                        <iframe 
                            width="100%" 
                            height="${props.height || '315'}" 
                            src="${props.src || ''}" 
                            frameborder="0" 
                            allowfullscreen 
                            style="${styles}"
                        ></iframe>
                    </div>`;
            }
            case 'RawHtml': {
                return `<div style="width: 100%">${props.html || ''}</div>`;
            }
            default:
                return children;
        }
    };

    return renderNode('ROOT');
};

/**
 * Parses HTML back to a Craft.js-like node structure.
 * This is a simplified version that tries to map tags to our components.
 */
export const parseHtmlToNodes = (html: string): any => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const nodes: any = {};
    let nodeCounter = 0;

    const createNodeId = () => `node-${++nodeCounter}`;

    const processElement = (element: Element, parentId: string | null = null): string => {
        const id = parentId === null ? 'ROOT' : createNodeId();
        const tagName = element.tagName.toLowerCase();
        
        let nodeData: any = {
            type: { resolvedName: 'Container' },
            isCanvas: true, // Containers are canvases by default in our editor
            props: {},
            nodes: [],
            linkedNodes: {},
            displayName: 'Container',
            custom: {},
            parent: parentId,
            hidden: false
        };

        // Try to identify the component type
        if (tagName === 'img') {
            nodeData.type.resolvedName = 'Image';
            nodeData.displayName = 'Image';
            nodeData.isCanvas = false;
            nodeData.props = {
                src: element.getAttribute('src'),
                alt: element.getAttribute('alt'),
            };
        } else if (tagName === 'iframe') {
            nodeData.type.resolvedName = 'Video';
            nodeData.displayName = 'Video';
            nodeData.isCanvas = false;
            nodeData.props = {
                src: element.getAttribute('src'),
            };
        } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].includes(tagName)) {
            nodeData.type.resolvedName = 'Text';
            nodeData.displayName = 'Text';
            nodeData.isCanvas = false;
            nodeData.props = {
                text: element.innerHTML,
                tagName: tagName,
            };
        } else if (tagName === 'a' && (element.classList.contains('button-like') || element.getAttribute('style')?.includes('background'))) {
            nodeData.type.resolvedName = 'Button';
            nodeData.displayName = 'Button';
            nodeData.isCanvas = false;
            nodeData.props = {
                text: element.textContent,
                href: element.getAttribute('href'),
            };
        } else if (element.children.length === 0 && element.textContent?.trim() && tagName !== 'div') {
             // Fallback to text for any element with content but no children (and not a container div)
            nodeData.type.resolvedName = 'Text';
            nodeData.displayName = 'Text';
            nodeData.isCanvas = false;
            nodeData.props = {
                text: element.innerHTML,
                tagName: 'p',
            };
        }

        // Process children
        Array.from(element.children).forEach(child => {
            const childId = processElement(child, id);
            nodeData.nodes.push(childId);
        });

        // Special case: if it's a Container with no components found inside but HAS HTML, use RawHtml
        if (nodeData.type.resolvedName === 'Container' && nodeData.nodes.length === 0 && element.innerHTML.trim()) {
             const rawId = createNodeId();
             nodeData.nodes.push(rawId);
             nodes[rawId] = {
                 type: { resolvedName: 'RawHtml' },
                 isCanvas: false,
                 props: { html: element.innerHTML },
                 nodes: [],
                 linkedNodes: {},
                 displayName: 'RawHtml',
                 custom: {},
                 parent: id,
                 hidden: false
             };
        }

        nodes[id] = nodeData;
        return id;
    };

    // We expect the HTML to have a single root or we wrap it
    const rootElement = doc.body.children.length === 1 ? doc.body.children[0] : doc.body;
    processElement(rootElement);

    return nodes;
};
