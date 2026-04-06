import React from 'react';
import { Button } from '@/components/ui/button';

interface NodeData {
    type: string | { resolvedName: string };
    isCanvas: boolean;
    props: any;
    displayName: string;
    custom: Record<string, any>;
    hidden: boolean;
    nodes: string[];
    linkedNodes: Record<string, string>;
}

export const CraftRenderer = ({ data }: { data: string }) => {
    let parsed: Record<string, NodeData> = {};
    
    // Attempt to parse JSON. If it fails, assume it's legacy raw HTML.
    try {
        parsed = JSON.parse(data);
    } catch {
        return <div dangerouslySetInnerHTML={{ __html: data }} className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-p:leading-relaxed prose-p:text-muted-foreground prose-strong:text-foreground" />;
    }

    // If it parsed as JSON but does not follow Craft.js root structure, assume it's some other JSON but try HTML fallback anyway (or it might be an empty string)
    if (!parsed || (typeof parsed === 'object' && !parsed['ROOT'])) {
         return <div dangerouslySetInnerHTML={{ __html: data }} className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-p:leading-relaxed prose-p:text-muted-foreground prose-strong:text-foreground" />;
    }

    const renderNode = (nodeId: string): React.ReactNode => {
        const node = parsed[nodeId];
        if (!node) return null;

        const resolvedName = typeof node.type === 'string' ? node.type : node.type.resolvedName;
        const props = node.props || {};
        const children = (node.nodes || []).map(id => renderNode(id));

        switch (resolvedName) {
            case 'Container':
                return (
                    <div 
                        key={nodeId} 
                        style={{ 
                            background: props.background === 'transparent' ? undefined : props.background, 
                            padding: `${props.padding || 0}px`, 
                            display: 'flex', 
                            flexDirection: props.flexDirection || 'column', 
                            alignItems: props.alignItems || 'flex-start', 
                            justifyContent: props.justifyContent || 'flex-start',
                            width: '100%'
                        }}
                    >
                        {children}
                    </div>
                );
            case 'Text': {
                let TagName = props.tagName || 'p';
                
                // HTML5 prevents nesting block elements (like <p>, <div>, <h1>) inside a <p>.
                // If a user copied/pasted rich text with <p> tags, the browser auto-closes the parent <p>
                // before React hydrates, resulting in a server/client DOM mismatch error.
                // We defensively switch to a <div> if we're rendering a <p> and see nested blocks.
                if (TagName === 'p') {
                    const hasBlockElements = /<(p|div|h[1-6]|ul|ol|li|blockquote|table|figure)[^>]*>/i.test(props.text || '');
                    if (hasBlockElements) TagName = 'div';
                }
                
                const Tag = TagName as any;
                
                return (
                    <div 
                        key={nodeId} 
                        className="p-1 min-h-[1em]"
                        style={{ 
                            margin: props.margin ? `${props.margin[0]}px ${props.margin[1]}px ${props.margin[2]}px ${props.margin[3]}px` : '0',
                        }}
                    >
                        <Tag dangerouslySetInnerHTML={{ __html: props.text || '' }} style={{ 
                            fontSize: `${props.fontSize || 16}px`, 
                            textAlign: props.textAlign || 'left', 
                            fontWeight: props.fontWeight || 'normal', 
                            color: props.color || 'inherit',
                            margin: 0
                        }} />
                    </div>
                );
            }
            case 'Button':
                return (
                    <div key={nodeId} style={{ display: 'inline-block' }}>
                        <a href={props.href || '#'} target="_blank" rel="noopener noreferrer">
                            <Button variant={props.variant || 'default'} size={props.size || 'default'}>
                                {props.text || 'Button Content'}
                            </Button>
                        </a>
                    </div>
                );
            case 'Image':
                return (
                    <div key={nodeId} style={{ 
                        display: 'inline-block',
                        width: typeof props.width === 'number' ? `${props.width}px` : props.width || '100%',
                        maxWidth: '100%'
                    }}>
                        {props.src ? (
                            <img src={props.src} alt={props.alt || 'Image'} style={{
                                width: '100%',
                                height: typeof props.height === 'number' ? `${props.height}px` : props.height || 'auto',
                                objectFit: props.objectFit || 'cover',
                                borderRadius: `${props.borderRadius || 0}px`,
                                display: 'block'
                            }} />
                        ) : null}
                    </div>
                );
            case 'Video':
                return (
                    <div key={nodeId} style={{ 
                        display: 'inline-block',
                        width: typeof props.width === 'number' ? `${props.width}px` : props.width || '100%',
                        maxWidth: '100%'
                    }}>
                        {props.src ? (
                            <iframe
                                width="100%"
                                height={typeof props.height === 'number' ? `${props.height}px` : props.height || '315px'}
                                src={props.src}
                                title="Video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ borderRadius: `${props.borderRadius || 0}px`, display: 'block', backgroundColor: '#000' }}
                            />
                        ) : null}
                    </div>
                );
            case 'RawHtml':
                return (
                    <div 
                        key={nodeId} 
                        className="p-1 min-h-[2em] w-full"
                        style={{ margin: props.margin ? `${props.margin[0]}px ${props.margin[1]}px ${props.margin[2]}px ${props.margin[3]}px` : '0' }}
                    >
                        {props.html ? <div dangerouslySetInnerHTML={{ __html: props.html }} /> : null}
                    </div>
                );
            default:
                // Handle unmapped craft root nodes gracefully or simple text strings
                try {
                     return React.createElement(resolvedName as any, { key: nodeId, ...props }, children.length > 0 ? children : undefined);
                } catch {
                     return <div key={nodeId}>{children}</div>
                }
        }
    };

    return <div className="craft-renderer-wrapper">{renderNode('ROOT')}</div>;
};
