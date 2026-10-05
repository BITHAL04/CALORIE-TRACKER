import StatCard from '../ui-components/parts/StatCard';

const MainContent = () => {
return (
<div className="relative z-50 nexafit-container py-6 md:py-4 md:px-2 px-4">
    <div className="flex flex-col md:flex-row gap-10 items-start">  
        <div className="md:w-4/5 md:pr-8 animate-text-slide-in-left">
            <h2 className="text-4xl md:text-8xl font-bold mb-1 text-gray-800">
                Pioneering wellness
            </h2>
            <div className="flex justify-end md:-mt-12">
                <img
                    loading="lazy"
                    src="/pentacle-spinner.webp"
                    className="object-contain max-w-full aspect-square w-[120px] animate-[spin_4500ms_ease-in-out]"
                    alt=""
                />
            </div>
        </div>
        <div className="flex flex-col gap-8 relative animate-slide-in-right">
            <p className="text-lg text-gray-700 mb-4 md:pl-24">
            At nexaFit, we're not just another health consulting firm that says they care; we're catalysts of change, drivers of growth. <br/> We put the onus on you. Every service. Tailored to you.
            </p>
            
            <div className="flex gap-8">
                <div 
                    className="absolute -right-40 z-0 w-full h-2/3 md:h-full bg-nexafit-green rounded-3xl"
                    style={{ transform: 'skewX(20deg)' }}
                ></div>
                <div 
                    className="md:opacity-100 opacity-0 absolute top-1/3 -right-2 w-2/5 h-1/2 md:h-2/3 bg-nexafit-footer rounded-3xl"
                    style={{ transform: 'skewX(20deg)' }}
                >
                </div>

                <div className="w-1/2 flex flex-col items-center py-4 space-y-4">
                    <div className="w-48 h-48 rounded-lg overflow-hidden shadow-lg">
                        <img 
                            src="/hero-image.webp" 
                            alt="NexaFit hero" 
                            className="relative z-10 w-full h-full object-cover object-center"
                        />
                    </div>

                    <div className="w-48 h-12 rounded-lg overflow-hidden shadow-lg">
                        <img 
                            src="/nexaFit_pixel_font.gif" 
                            alt="NexaFit animated logo" 
                            className="relative z-10 w-full h-full object-cover object-center"
                        />
                    </div>

                </div>

                <div className="w-1/2 flex flex-col justify-center gap-2 py-4 md:pt-16 pt-36">
                    <div className="z-10 self-start"
                        style={{ transform: 'skewX(-20deg)' }}>
                        <StatCard number="500+" text="Happy clients" />
                    </div>
                    <div className="z-20 self-end"
                        style={{ transform: 'skewX(-20deg)' }}>
                        <StatCard number="20+" text="Nutritionists and trainers on call" />
                    </div>

                </div>

            </div>
        </div>
    </div>
</div>
);
};

export default MainContent;