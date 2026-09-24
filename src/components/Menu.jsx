import React, { useEffect, useState, useRef } from 'react'
import gsap from 'gsap';
import ItemModal from "../components/ItemModal";

// const API_URL = "http://127.0.0.1:8000";
const API_URL = "https://lcd-dressing-jim-oven.trycloudflare.com"

const Menu = () => {

    const [foodMenu, setFoodMenu] = useState([]);

    const [SelectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Show only 3 items initially
    const [showAll, setShowAll] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Refs for GSAP — section scope, heading, and the food-card grid
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const gridRef = useRef(null);
    const cardRefs = useRef([]);
    cardRefs.current = [];

    const addCardRef = (el) => {
        if (el && !cardRefs.current.includes(el)) {
            cardRefs.current.push(el);
        }
    };


    // ==============================
    // GET FOOD FROM FASTAPI
    // ==============================

    useEffect(() => {

        const fetchFood = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await fetch(`${API_URL}/food`);

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.detail || "Food load nahi ho paya."
                    );
                }

                // Backend response:
                // {
                //   "food": [...]
                // }

                const foods = result.food || [];

                // Backend fields ko existing UI fields
                // ke according convert kar rahe hain
                const formattedFood = foods.map((food) => ({
                    id: food.id,
                    title: food.name,
                    price: `₹${food.price}`,
                    ingredients: food.description,
                    image: food.image,
                    category: food.category,
                    available: food.available
                }));

                setFoodMenu(formattedFood);

            } catch (err) {

                console.error("Food API Error:", err);

                setError(
                    err.message ||
                    "Server se food data nahi mil paya."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchFood();

    }, []);


    // ==============================
    // GSAP — heading entrance
    // Start: on mount (gsap.context)
    // End: ctx.revert() on unmount
    // ==============================
    useEffect(() => {
        const ctx = gsap.context(() => {

            gsap.fromTo(
                headingRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
            );

        }, sectionRef);

        return () => ctx.revert();
    }, []);


    // ==============================
    // GSAP — food cards entrance
    // Re-runs whenever the visible list changes (data load,
    // Show Full Menu / Show Less toggle). Each run has its own
    // clean start and its own clean end (revert before next run).
    // ==============================
    useEffect(() => {

        if (loading || error || cardRefs.current.length === 0) return;

        const ctx = gsap.context(() => {

            gsap.fromTo(
                cardRefs.current,
                { opacity: 0, y: 30, scale: 0.97 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power3.out',
                    stagger: 0.1,
                }
            );

        }, gridRef);

        return () => ctx.revert(); // GSAP end — revert before re-running or on unmount

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, error, showAll, foodMenu]);


    // ==============================
    // OPEN MODAL
    // ==============================

    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    }


    // ==============================
    // CLOSE MODAL
    // ==============================

    const closeModel = () => {
        setSelectedItem(null);
        setIsModalOpen(false);
    }


    // ==============================
    // SHOW 3 OR ALL FOOD
    // ==============================

    const visibleFood = showAll
        ? foodMenu
        : foodMenu.slice(0, 3);


    // Small interactive press feedback for the toggle button
    const animateButtonPress = (el) => {
        if (!el) return;
        gsap.timeline()
            .to(el, { scale: 0.94, duration: 0.1, ease: 'power1.out' })
            .to(el, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
    };


    return (
        <section id='menu' ref={sectionRef} className='py-8 bg-white'>

            <div className='container mx-auto px-6'>

                {/* Heading section */}

                <div ref={headingRef} className='text-center'>

                    <h2
                        className='text-3xl sm:text-4xl mb-3 font-bold text-black underline underline-offset-5 decoration-red-600'
                    >
                        Our Menu
                    </h2>

                    <p className='text-gray-700 mb-4'>
                        Crafted with passion and the finest ingredients
                    </p>

                </div>


                <div className='max-w-4xl mx-auto'>


                    {/* Loading */}

                    {loading && (
                        <div className='text-center py-10'>

                            <p className='text-gray-700'>
                                Loading menu...
                            </p>

                        </div>
                    )}


                    {/* Error */}

                    {!loading && error && (
                        <div className='text-center py-10'>

                            <p className='text-red-600'>
                                {error}
                            </p>

                        </div>
                    )}


                    {/* Food Cards section */}

                    {!loading && !error && (

                        <div ref={gridRef} className='grid grid-cols-1 md:grid-cols-3 gap-8'>

                            {
                                visibleFood.map((food, index) => {

                                    return (

                                        <div
                                            key={food.id || index}
                                            ref={addCardRef}
                                            onClick={() => openModal(food)}
                                            className='
                                                rounded-2xl
                                                shadow-2xl
                                                overflow-hidden
                                                hover:scale-105
                                                transition
                                                duration-300
                                                cursor-pointer
                                            '
                                        >

                                            <img
                                                className='w-full h-96 object-cover'
                                                src={food.image}
                                                alt={food.title}
                                            />


                                            <div className='p-4'>

                                                <div className='flex justify-between items-center mb-4'>

                                                    <h1 className='text-xl text-gray-900 font-semibold'>
                                                        {food.title}
                                                    </h1>

                                                    <span className='text-red-600 font-semibold'>
                                                        {food.price}
                                                    </span>

                                                </div>


                                                <p className='text-sm text-gray-800'>
                                                    ingredients : {food.ingredients}
                                                </p>

                                            </div>

                                        </div>

                                    )

                                })
                            }

                        </div>

                    )}


                    {/* No Food */}

                    {!loading &&
                        !error &&
                        foodMenu.length === 0 && (

                            <div className='text-center py-10'>

                                <p className='text-gray-700'>
                                    No food items available.
                                </p>

                            </div>

                        )
                    }


                    {/* Modal */}

                    <ItemModal
                        isopen={isModalOpen}
                        onClose={closeModel}
                        item={SelectedItem}
                    />


                    {/* View Full Menu Button */}

                    {
                        !loading &&
                        !error &&
                        foodMenu.length > 3 && (

                            <div className='text-center'>

                                <button
                                    onClick={(e) => {
                                        animateButtonPress(e.currentTarget);
                                        setShowAll(!showAll);
                                    }}
                                    className='
                                        bg-red-600
                                        hover:bg-red-700
                                        rounded-full
                                        px-8
                                        py-3
                                        mt-8
                                        text-white
                                        cursor-pointer
                                        transition
                                        duration-300
                                    '
                                >

                                    {
                                        showAll
                                            ? 'Show Less'
                                            : 'View Full Menu'
                                    }

                                </button>

                            </div>

                        )
                    }

                </div>

            </div>

        </section>
    )
}

export default Menu;