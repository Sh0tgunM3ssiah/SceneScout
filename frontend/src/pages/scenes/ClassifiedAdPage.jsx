import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import MessageBoard from "../../components/common/MessageBoard";
import Classifieds from "../../components/common/Classifieds";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import ClassifiedAdDetail from "../../components/common/ClassifiedAdDetail";

import { FaArrowLeft, FaMusic } from "react-icons/fa6";
import { IoCalendarOutline, IoLocationOutline } from "react-icons/io5";

const ClassifiedAdPage = () => {
    const [coverImg, setCoverImg] = useState(null);
    const [feedType, setFeedType] = useState("messageBoard");
    const [selectedSceneId, setSelectedSceneId] = useState('');
    const [selectedSceneName, setSelectedSceneName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const navigate = useNavigate();
    const { adId } = useParams();

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    return (
        <div className='flex-[4_4_0] border border-gray-700 min-h-screen pt-16 md:pt-0'>
            {(isLoading || isRefetching) && !adId && <ProfileHeaderSkeleton />}
            {!isLoading && !isRefetching && !adId && <p className='text-center text-lg mt-4'>Ad not found</p>}
            <div className='flex flex-col'>
                {!isLoading && !isRefetching && (
                    <>
                        <div className='flex gap-10 px-4 py-2 items-center border-b border-gray-700'>
                            <Link to='/'>
                                <FaArrowLeft className='w-4 h-4' />
                            </Link>
                            <div className='flex flex-col'>
                                <p className='font-bold text-lg'>Classifieds</p>
                                <span className='text-sm text-slate-500'>{adId}</span>
                            </div>
                        </div>
                    </>
                )}

                <div className="flex-grow">
                    <ClassifiedAdDetail user={authUser}/>
                </div>
            </div>
        </div>
    );
};

export default ClassifiedAdPage;