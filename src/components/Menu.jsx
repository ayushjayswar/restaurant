import React, { useEffect, useState, useRef } from 'react'
import gsap from 'gsap';
import { Search, X } from 'lucide-react';
import ItemModal from "../components/ItemModal";

// const API_URL = "http://127.0.0.1:8000";
const API_URL = "https://lcd-dressing-jim-oven.trycloudflare.com"

const Menu = () => {

    const [foodMenu, setFoodMenu] = useState([]);

    const [SelectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Show only 3 items initially
    const [showAll, setShowAll] = useState(false);

    // Search bar
    const [searchTerm, setSearchTerm] = useState("");

    // Category filter — "all" means no category filter applied
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Refs for GSAP — section scope, heading, and the food-card grid
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const particlesRef = useRef(null);
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

                const foods = result.food || [];

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
    // GSAP START — heading char reveal + floating particles
    // (matches RoomBooking hero treatment)
    // ==============================
    useEffect(() => {
        const reduceMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const ctx = gsap.context(() => {
            const titleEl = titleRef.current;
            if (!titleEl) return;

            const text = titleEl.textContent;
            titleEl.textContent = '';
            const chars = text.split('').map((ch) => {
                const span = document.createElement('span');
                span.textContent = ch === ' ' ? '\u00A0' : ch;
                span.style.display = 'inline-block';
                span.style.opacity = reduceMotion ? '1' : '0';
                span.style.willChange = 'transform, opacity, filter';
                titleEl.appendChild(span);
                return span;
            });

            if (reduceMotion) {
                gsap.set('.menu-subtitle', { opacity: 1 });
            } else {
                gsap.timeline({ defaults: { ease: 'power3.out' } })
                    .to(chars, {
                        opacity: 1,
                        filter: 'blur(0px)',
                        duration: 0.9,
                        stagger: { each: 0.035, from: 'start' },
                        color: '#FF7A45',
                    })
                    .to(
                        chars,
                        {
                            color: '#F4EFE6',
                            duration: 0.6,
                            stagger: { each: 0.02, from: 'start' },
                        },
                        '-=0.3'
                    )
                    .fromTo(
                        '.menu-subtitle',
                        { opacity: 0, y: 14 },
                        { opacity: 1, y: 0, duration: 0.7 },
                        '-=0.5'
                    );
            }

            const field = particlesRef.current;
            if (field && !reduceMotion) {
                const count = 14;
                for (let i = 0; i < count; i++) {
                    const dot = document.createElement('span');
                    dot.style.position = 'absolute';
                    dot.style.bottom = '0';
                    dot.style.borderRadius = '50%';
                    dot.style.background =
                        'radial-gradient(circle, #FF7A45, transparent 70%)';
                    const size = gsap.utils.random(2, 5);
                    dot.style.width = `${size}px`;
                    dot.style.height = `${size}px`;
                    dot.style.left = `${gsap.utils.random(0, 100)}%`;
                    field.appendChild(dot);

                    gsap.set(dot, { y: gsap.utils.random(20, 80) + 'vh', opacity: 0 });
                    gsap.to(dot, {
                        opacity: gsap.utils.random(0.3, 0.7),
                        duration: gsap.utils.random(6, 12),
                        delay: gsap.utils.random(0, 6),
                        repeat: -1,
                        ease: 'none',
                        onRepeat: () => {
                            gsap.set(dot, { x: 0, left: `${gsap.utils.random(0, 100)}%` });
                        },
                    });
                    gsap.to(dot, {
                        x: gsap.utils.random(-30, 30),
                        duration: gsap.utils.random(2, 4),
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                    });
                }
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);
    // ==============================
    // GSAP END
    // ==============================


    // ==============================
    // GSAP — food cards entrance
    // Re-runs whenever the visible list changes (data load,
    // Show Full Menu / Show Less toggle, search). Each run has
    // its own clean start and its own clean end (revert before
    // next run).
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
    }, [loading, error, showAll, foodMenu, searchTerm, selectedCategory]);


    // Small interactive press feedback for the toggle button
    const animateButtonPress = (el) => {
        if (!el) return;
        gsap.timeline()
            .to(el, { scale: 0.94, duration: 0.1, ease: 'power1.out' })
            .to(el, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
    };


    // ==============================
    // OPEN / CLOSE MODAL
    // ==============================

    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    }

    const closeModel = () => {
        setSelectedItem(null);
        setIsModalOpen(false);
    }


    // ==============================
    // CATEGORIES
    // Admin ne food add karte waqt jo bhi
    // category likhi hai, unhi se ye list
    // apne aap ban jaati hai — koi hardcoding
    // nahi. "All" hamesha pehla option hoga.
    // ==============================

    const categories = [
        "All",
        ...Array.from(
            new Set(
                foodMenu
                    .map((food) => food.category)
                    .filter((category) => category && category.trim())
            )
        ),
    ];


    // ==============================
    // SEARCH + CATEGORY FILTER
    // ==============================

    const isSearching = searchTerm.trim().length > 0;
    const isCategoryFiltered = selectedCategory !== "All";
    const isFiltering = isSearching || isCategoryFiltered;

    const filteredFood = foodMenu.filter((food) => {

        const query = searchTerm.trim().toLowerCase();

        const matchesSearch = !isSearching || (
            food.title?.toLowerCase().includes(query) ||
            food.ingredients?.toLowerCase().includes(query) ||
            food.category?.toLowerCase().includes(query)
        );

        const matchesCategory =
            !isCategoryFiltered ||
            food.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });


    // ==============================
    // SHOW 3 OR ALL FOOD
    // ==============================

    const visibleFood = isFiltering
        ? filteredFood
        : (showAll ? foodMenu : foodMenu.slice(0, 3));


    return (
        <section
            id='menu'
            ref={sectionRef}
            className='relative bg-[#17110D] text-[#F4EFE6] font-[Inter,system-ui,sans-serif] py-5 overflow-hidden'
        >

            <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none" />

            <div className='relative z-10 container mx-auto px-6'>

                {/* Heading section */}

                <div className='text-center mb-5'>

                    <div className="text-[#B08D57] text-sm tracking-wide mb-4">
                        Fork &amp; Flame · Our Menu
                    </div>

                    <h2
                        ref={titleRef}
                        className='font-[Fraunces,serif] font-medium text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]'
                    >
                        Our Menu
                    </h2>

                    <p className='menu-subtitle mt-5 max-w-[46ch] mx-auto text-[#F4EFE6]/75 text-[1.05rem] leading-relaxed'>
                        Crafted with passion and the finest ingredients
                    </p>

                </div>


                <div className='max-w-4xl mx-auto'>


                    {/* Search Bar */}

                    {!loading && !error && foodMenu.length > 0 && (

                        <div className='max-w-md mx-auto mb-10'>

                            <div className='
                                relative
                                flex
                                items-center
                                bg-[#1F1712]
                                border
                                border-white/10
                                rounded-[3px]
                                px-5
                                py-3
                                focus-within:border-[#FF7A45]
                                transition-colors
                                duration-300
                            '>

                                <Search size={18} className='text-[#B08D57] shrink-0' />

                                <input
                                    type='text'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder='Search for dishes, ingredients...'
                                    className='
                                        w-full
                                        bg-transparent
                                        outline-none
                                        px-3
                                        text-sm
                                        text-[#F4EFE6]
                                        placeholder:text-[#F4EFE6]/40
                                    '
                                />

                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className='text-[#F4EFE6]/40 hover:text-[#FF7A45] transition-colors duration-300 shrink-0'
                                        aria-label='Clear search'
                                    >
                                        <X size={18} />
                                    </button>
                                )}

                            </div>


                            {/* Category Filter Pills */}

                            {categories.length > 1 && (

                                <div className='
                                    flex
                                    flex-wrap
                                    justify-center
                                    gap-2
                                    mt-4
                                '>

                                    {categories.map((category) => {

                                        const active = selectedCategory === category;

                                        return (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={`
                                                    px-4
                                                    py-1.5
                                                    rounded-[3px]
                                                    text-sm
                                                    font-medium
                                                    border
                                                    transition-colors
                                                    duration-300
                                                    ${
                                                        active
                                                            ? 'bg-[#C1440E] border-[#C1440E] text-[#F4EFE6]'
                                                            : 'bg-transparent border-[#B08D57]/50 text-[#F4EFE6]/70 hover:border-[#FF7A45] hover:text-[#FF7A45]'
                                                    }
                                                `}
                                            >
                                                {category}
                                            </button>
                                        );
                                    })}

                                </div>

                            )}

                        </div>

                    )}


                    {/* Loading */}

                    {loading && (
                        <div className='text-center py-10'>
                            <p className='text-[#F4EFE6]/70'>
                                Loading menu...
                            </p>
                        </div>
                    )}


                    {/* Error */}

                    {!loading && error && (
                        <div className='text-center py-10'>
                            <p className='text-red-400'>
                                {error}
                            </p>
                        </div>
                    )}


                    {/* No Filtered Results */}

                    {!loading &&
                        !error &&
                        isFiltering &&
                        filteredFood.length === 0 && (

                            <div className='text-center py-10'>
                                <p className='text-[#F4EFE6]/70'>
                                    {isSearching
                                        ? `"${searchTerm}" se milta koi item nahi mila.`
                                        : `${selectedCategory} category mein koi item nahi mila.`}
                                </p>
                            </div>

                        )
                    }


                    {/* Food Cards section */}

                    {!loading && !error && visibleFood.length > 0 && (

                        <div ref={gridRef} className='grid grid-cols-1 md:grid-cols-3 gap-8'>

                            {
                                visibleFood.map((food, index) => {

                                    return (

                                        <div
                                            key={food.id || index}
                                            ref={addCardRef}
                                            onClick={() => openModal(food)}
                                            className='
                                                group
                                                bg-[#1F1712]
                                                border
                                                border-white/10
                                                rounded-md
                                                overflow-hidden
                                                cursor-pointer
                                                transition-all
                                                duration-300
                                                hover:border-[#FF7A45]/60
                                                hover:-translate-y-1
                                            '
                                        >

                                            <div className='overflow-hidden'>
                                                <img
                                                    className='w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105'
                                                    src={food.image}
                                                    alt={food.title}
                                                />
                                            </div>


                                            <div className='p-5'>

                                                <div className='flex justify-between items-baseline gap-3 mb-3'>

                                                    <h3 className='font-[Fraunces,serif] font-medium text-lg text-[#F4EFE6]'>
                                                        {food.title}
                                                    </h3>

                                                    <span className='text-[#FF7A45] font-semibold shrink-0'>
                                                        {food.price}
                                                    </span>

                                                </div>


                                                <p className='text-sm text-[#F4EFE6]/65 leading-relaxed'>
                                                    {food.ingredients}
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
                                <p className='text-[#F4EFE6]/70'>
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
                        !isFiltering &&
                        foodMenu.length > 3 && (

                            <div className='text-center'>

                                <button
                                    onClick={(e) => {
                                        animateButtonPress(e.currentTarget);
                                        setShowAll(!showAll);
                                    }}
                                    className='
                                        inline-flex
                                        items-center
                                        gap-2
                                        bg-[#C1440E]
                                        hover:bg-[#FF7A45]
                                        rounded-[3px]
                                        px-8
                                        py-3.5
                                        mt-10
                                        text-[#F4EFE6]
                                        text-[0.95rem]
                                        font-medium
                                        cursor-pointer
                                        transition-colors
                                        duration-300
                                        hover:-translate-y-0.5
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