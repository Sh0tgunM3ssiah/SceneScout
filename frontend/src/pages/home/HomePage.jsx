import { useState, useEffect } from 'react';
import Posts from '../../components/common/Posts';
import CreatePost from './CreatePost';
import { useQuery } from '@tanstack/react-query';

const HomePage = () => {
    const [feedType, setFeedType] = useState('forYou');
    const [selectedSceneId, setSelectedSceneId] = useState('');
    const [selectedSceneName, setSelectedSceneName] = useState('');

    const { data: authUser } = useQuery({
        queryKey: ['authUser'],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`);
            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }
            return await response.json();
        }
    });

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
        if (authUser && authUser.sceneId) {
            setSelectedSceneId(authUser.sceneId); // Set default scene ID based on authUser
        }
    }, [scenes, authUser]);

    const handleSceneSelection = (e) => {
        setSelectedSceneId(e.target.value);
        const selectedOption = e.target.options[e.target.selectedIndex];
        setSelectedSceneName(selectedOption.getAttribute('data-scenename'));
    };

    return (
        <>
            <div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen flex flex-col pt-16 md:pt-0'>
                <div className='flex w-full border-b border-gray-700 p-3 justify-center'>
                    <div className='flex justify-center items-center gap-4'>
                        <button className={`btn btn-ghost ${feedType === 'forYou' ? 'text-primary font-bold' : ''}`}
                            onClick={() => setFeedType('forYou')}>
                            For you
                        </button>
                        <button className={`btn btn-ghost ${feedType === 'following' ? 'text-primary font-bold' : ''}`}
                            onClick={() => setFeedType('following')}>
                            Following
                        </button>
                    </div>
                </div>

                <CreatePost sceneId={selectedSceneId} sceneName={selectedSceneName} />

                {feedType === 'forYou' && (
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
				)}

                <Posts feedType={feedType} sceneId={selectedSceneId} />
            </div>
        </>
    );
};
export default HomePage;
