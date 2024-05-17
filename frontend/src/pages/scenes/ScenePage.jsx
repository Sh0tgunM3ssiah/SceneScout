import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import MessageBoard from "../../components/common/MessageBoard";
import Classifieds from "../../components/common/Classifieds";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import ClassifiedAdDetail from "../../components/common/ClassifiedAdDetail";

import { FaArrowLeft, FaMusic } from "react-icons/fa6";
import { IoCalendarOutline, IoLocationOutline } from "react-icons/io5";

const ScenePage = () => {
    const [coverImg, setCoverImg] = useState(null);
    const [feedType, setFeedType] = useState("messageBoard");
    const [selectedSceneId, setSelectedSceneId] = useState('');
    const [selectedSceneName, setSelectedSceneName] = useState('');

    const coverImgRef = useRef(null);
    const navigate = useNavigate();
    const { sceneId, adId } = useParams();

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const { data: scenes, isLoading: loadingScenes, error: scenesError } = useQuery({
        queryKey: ['scenes'],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/scenes/`);
            if (!response.ok) {
                throw new Error('Failed to fetch scenes');
            }
            return await response.json();
        }
    });

    const {
        data: scene,
        isLoading,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: ['scene', selectedSceneId],
        queryFn: async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/scenes/${selectedSceneId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        enabled: !!selectedSceneId,
    });

    // Organize scenes by state
    const organizeScenesByState = (scenes) => {
        const sortedScenes = scenes.sort((a, b) => a.state.localeCompare(b.state));
        const scenesByState = sortedScenes.reduce((acc, scene) => {
            acc[scene.state] = acc[scene.state] || [];
            acc[scene.state].push(scene);
            return acc;
        }, {});
        return scenesByState;
    };

    const [organizedScenes, setOrganizedScenes] = useState({});

    useEffect(() => {
        if (scenes) {
            setOrganizedScenes(organizeScenesByState(scenes));
        }
        if (authUser && authUser.sceneId && !selectedSceneId) {
            setSelectedSceneId(authUser.sceneId);
            setSelectedSceneName(authUser.sceneName);
        }
    }, [scenes, authUser, selectedSceneId]);

    const handleSceneSelection = (e) => {
        setSelectedSceneId(e.target.value);
        const selectedOption = e.target.options[e.target.selectedIndex];
        setSelectedSceneName(selectedOption.getAttribute('data-scenename'));
    };

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setCoverImg(reader.result);
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        refetch();
    }, [selectedSceneId, refetch]);

    return (
        <div className='flex-[4_4_0] border border-gray-700 min-h-screen pt-16 md:pt-0'>
            {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
            {!isLoading && !isRefetching && !scene && <p className='text-center text-lg mt-4'>Scene not found</p>}
            <div className='flex flex-col'>
                {!isLoading && !isRefetching && scene && (
                    <>
                        <div className='flex gap-10 px-4 py-2 items-center'>
                            <Link to='/'>
                                <FaArrowLeft className='w-4 h-4' />
                            </Link>
                            <div className='flex flex-col'>
                                <p className='font-bold text-lg'>{scene?.name}</p>
                                <span className='text-sm text-slate-500'>{scene?.description}</span>
                            </div>
                        </div>
                        <div className='relative group/cover'>
                            <img
                                src={scene?.coverImg || "/default_cover.jpg"}
                                className='h-52 w-full object-cover'
                                alt='cover image'
                            />
                        </div>
                        <div className='flex justify-center px-4 py-2'>
                            <div className='w-full'>
                                <div className='scene-selector'>
                                    <label className='scene-label font-bold'>Select A Scene:</label>
                                    <select 
                                        name="sceneId" 
                                        onChange={handleSceneSelection}
                                        value={selectedSceneId} 
                                        className="scene-select select rounded select-bordered flex-1"
                                    >
                                        <option value="">Select a Scene</option>
                                        {Object.entries(organizedScenes).map(([state, scenes]) => (
                                            <optgroup label={state} key={state}>
                                                {scenes.map(scene => (
                                                    <option key={scene._id} value={scene._id} data-scenename={scene.name}>
                                                        {scene.name}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className='flex w-full border-b border-gray-700 mt-4'>
                            <div
                                className={`flex justify-center flex-1 p-3 transition duration-300 relative cursor-pointer ${feedType === "messageBoard" ? "bg-secondary" : ""}`}
                                onClick={() => setFeedType("messageBoard")}
                            >
                                Message Board
                                {feedType === "messageBoard" && (
                                    <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
                                )}
                            </div>
                            <div
                                className={`flex justify-center flex-1 p-3 transition duration-300 relative cursor-pointer ${feedType === "classifieds" ? "bg-secondary" : ""}`}
                                onClick={() => setFeedType("classifieds")}
                            >
                                Classifieds
                                {feedType === "classifieds" && (
                                    <div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
                                )}
                            </div>
                        </div>
                    </>
                )}

                <div className="flex-grow">
                    <Routes>
                        <Route path="classifieds/:adId" element={<ClassifiedAdDetail user={authUser} />} />
                        <Route path="/" element={
                            feedType === "messageBoard" ? (
                                <MessageBoard sceneId={selectedSceneId} user={authUser} sceneName={selectedSceneName} />
                            ) : (
                                <Classifieds sceneId={selectedSceneId} user={authUser} sceneName={selectedSceneName} />
                            )
                        } />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default ScenePage;
