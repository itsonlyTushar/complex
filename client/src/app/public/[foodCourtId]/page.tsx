"use client";

import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";

function PublicFoodCourtContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const foodCourtId = params?.foodCourtId;
    const tableId = searchParams?.get("tableId");

    const [foodCourtName, setFoodCourtName] = useState<string>("");
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!foodCourtId) return;

        const fetchRestaurants = async () => {
            try {
                const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/court/public/${foodCourtId}/restaurants`);
                if (tableId) {
                    url.searchParams.append("tableId", tableId);
                }
                const response = await fetch(url.toString());

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Failed to fetch data");
                }

                const data = await response.json();
                setRestaurants(data.restaurants);
                setFoodCourtName(data.foodCourt.name);
                setError(null);
            } catch (err: any) {
                console.error("Failed to fetch restaurants:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [foodCourtId, tableId]);

    if (!foodCourtId) return null;

    if (loading) {
        return (
            <div className="flex gap-2 justify-center items-center h-screen text-md">
                <Spinner />
                Wait while we load restaurants
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50 p-6">
                <div className="bg-red-50 text-red-600 p-8 rounded-3xl shadow-sm text-center max-w-md border border-red-100">
                    <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="text-3xl font-bold mb-2">Oops!</h2>
                    <p className="text-lg font-medium">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <main>
                <section className="relative h-screen w-full overflow-hidden bg-gray-900 rounded-b-[2.5rem] shadow-md">
                    <Image
                        fill
                        className="object-cover scale-[1.15]"
                        alt="welcome-image"
                        src={
                            "https://images.unsplash.com/photo-1665765401107-742047bc93a9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        }
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center text-white drop-shadow-md w-full">
                        <h1 className="text-7xl font-extrabold tracking-tight">Welcome</h1>
                        <p className="text-lg italic font-bold">to</p>
                        <span className="text-3xl font-semibold">
                            {foodCourtName}
                        </span>
                        {tableId && (
                            <div className="mt-6 block">
                                <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 shadow-lg">
                                    <p className="text-xl font-medium tracking-wide">Table <span className="font-bold text-white">{tableId}</span></p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <section className="py-12 px-6">
                {
                    restaurants.filter((r: any) => !r.isClosed).map((restaurant) => {
                        const logoUrl = restaurant?.logo || "";
                        const description = restaurant?.description || 'Lorem ipsum, dolor sit amet consectetur';

                        return (
                            <Link  
                            key={restaurant.id}
                            href={`/public/${foodCourtId}/${restaurant.id}${tableId ? `?tableId=${tableId}` : ''}`} >
                            <div  className="mb-8 border cursor-pointer py-4 px-4 rounded-xl flex gap-2 items-center justify-start bg-card">
                                {logoUrl ? (
                                    <Image alt="logo" src={logoUrl} width={70} height={70} className="object-cover rounded-full shrink-0 w-[70px] h-[70px]"/>
                                ) : (
                                    <div className="w-[70px] h-[70px] shrink-0"></div>
                                )}
                                <div className="ml-2">
                                    <h1 className="text-2xl font-bold">{restaurant?.name}</h1>
                                    <p className="text-gray-600 text-sm text-mutated">{description}</p>
                                </div>
                            </div>
                            </Link>
                        );
                    })
                }
            </section>
        </>
    );
}

export default function PublicFoodCourtPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <PublicFoodCourtContent />
        </Suspense>
    );
}
