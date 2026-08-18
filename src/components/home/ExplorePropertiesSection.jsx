import PropertyCard from '../PropertyCard';
import imgBlog1 from '../../assets/img/blog1.webp';
import imgBlog2 from '../../assets/img/blog2.webp';
import imgBlog3 from '../../assets/img/blog3.webp';

const ExplorePropertiesSection = () => {
    return (
        <section className="bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Explore Any Real Estate Property Type
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Find the perfect property that fits your requirements and budget from our extensive collection of verified listings.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <PropertyCard 
                        type="Rent"
                        image={imgBlog1}
                        photoCount={2}
                        title="116 Waverly Place"
                        location="NYC"
                        price="2800 Monthly"
                        area="5000"
                        baths="3"
                        beds="3"
                        parking="1"
                    />
                    <PropertyCard 
                        type="Buy"
                        image={imgBlog2}
                        photoCount={2}
                        title="232 East 63rd Street"
                        location="NYC"
                        price="250000"
                        area="5000"
                        baths="3"
                        beds="3"
                        parking="1"
                    />
                    <PropertyCard 
                        type="Buy"
                        image={imgBlog3}
                        photoCount={2}
                        title="55 Warren Street"
                        location="NYC"
                        price="300000"
                        area="5000"
                        baths="3"
                        beds="3"
                        parking="1"
                    />
                </div>
                
                <div className="text-center mt-12">
                    <a href="#" className="inline-block bg-accent hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-full transition-colors shadow-md">
                        View All Properties
                    </a>
                </div>
            </div>
        </section>
    );
};

export default ExplorePropertiesSection;
