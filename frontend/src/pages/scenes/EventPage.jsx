import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import EventDetail from "../../components/common/EventDetail";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline, IoLocationOutline } from "react-icons/io5";

const EventDetailPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const navigate = useNavigate();
    const { eventId } = useParams();

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    return (
        <div className='flex-[4_4_0] border border-gray-700 min-h-screen pt-16 md:pt-0'>
            {(isLoading || isRefetching) && !eventId && <ProfileHeaderSkeleton />}
            {!isLoading && !isRefetching && !eventId && <p className='text-center text-lg mt-4'>Event not found</p>}
            <div className='flex flex-col'>
                {!isLoading && !isRefetching && (
                    <>
                        <div className='flex gap-10 px-4 py-2 items-center border-b border-gray-700'>
                            <button onClick={() => navigate(-1)}>
                                <FaArrowLeft className='w-4 h-4' />
                            </button>
                            <div className='flex flex-col'>
                                <p className='font-bold text-lg'>Event Details</p>
                                <span className='text-sm text-slate-500'>{eventId}</span>
                            </div>
                        </div>
                    </>
                )}

                <div className="flex-grow">
                    <EventDetail user={authUser}/>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;
