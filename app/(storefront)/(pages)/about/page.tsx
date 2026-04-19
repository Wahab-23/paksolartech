import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";


export default function AboutPage() {
  return (
    <div className="container">
        <div className="relative mx-auto max-w-5xl px-4 pt-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-6 text-gradient">About Us</h1>
        <p className="text-md mb-4">
            At PakSolarTech, we are committed to providing top-notch solar energy solutions to our customers across Pakistan. With years of experience in the industry, we have established ourselves as a trusted name in solar panel installations, maintenance, and consulting services.
        </p>
        <p className="text-md mb-4">
            Our mission is to help individuals and businesses harness the power of the sun to reduce their carbon footprint and save on energy costs. We pride ourselves on our customer-centric approach, ensuring that every project is tailored to meet the unique needs of our clients.
        </p>
        <p className="text-md mb-4">
            Whether you're looking to install solar panels for your home or business, or need expert advice on the best solar solutions for your energy needs, PakSolarTech is here to help. Our team of skilled professionals is dedicated to delivering high-quality service and support every step of the way.
        </p>
        <p className="text-md">
            Join us in our mission to create a sustainable future by embracing solar energy. Contact us today to learn more about our services and how we can help you make the switch to clean, renewable energy.
        </p>
        </div>
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">
                Frequently <i className="text-gradient">Asked</i> Questions
            </h2>
            <Accordion type="single" collapsible className="mt-8" defaultValue="itemOne">
                <AccordionItem value="itemOne">
                    <AccordionTrigger>
                        What services does PakSolarTech offer?
                    </AccordionTrigger>
                    <AccordionContent>
                        We offer solar panel installations, maintenance, and consulting services for both residential and commercial clients across Pakistan.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="itemTwo">
                    <AccordionTrigger>
                        How can I get a quote for solar panel installation?
                    </AccordionTrigger>
                    <AccordionContent>
                        You can contact us through our website or call our customer service line to schedule a consultation and receive a personalized quote based on your energy needs.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="itemThree">
                    <AccordionTrigger>
                        Do you offer financing options for solar panel installations?
                    </AccordionTrigger>
                    <AccordionContent>
                        Yes, we offer flexible financing options to make it easier for our customers to invest in solar energy. Please contact us for more details on available financing plans.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </div>
  );
}