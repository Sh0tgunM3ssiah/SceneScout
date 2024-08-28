import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaLocationDot, FaCalendarDay, FaArrowLeft } from 'react-icons/fa6';

const SearchPage = ({ authUser }) => {
    const [searchParams, setSearchParams] = useState({
        scene: '',  
        searchType: '', // user or event
        userType: '',
        genre: '',
        startDate: '',
        endDate: '',
    });

    const [submittedSearchParams, setSubmittedSearchParams] = useState(searchParams);
    const [organizedScenes, setOrganizedScenes] = useState({});
    const [results, setResults] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch scenes as you do in ScenePage
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

    // Organize scenes by state like in ScenePage
    useEffect(() => {
        if (scenes) {
            const sortedScenes = scenes.sort((a, b) => a.state.localeCompare(b.state));
            const scenesByState = sortedScenes.reduce((acc, scene) => {
                acc[scene.state] = acc[scene.state] || [];
                acc[scene.state].push(scene);
                return acc;
            }, {});
            setOrganizedScenes(scenesByState);
        }
    }, [scenes]);

    const handleSearchChange = (e) => {
        setSearchParams(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setSubmittedSearchParams(searchParams); // Update the submitted search params
        await fetchSearchResults(searchParams, currentPage);
    };

    const fetchSearchResults = async (params, page) => {
        try {
            const queryParams = new URLSearchParams();

            // Add common parameters
            queryParams.append('scene', params.scene);
            queryParams.append('searchType', params.searchType);
            queryParams.append('page', page);
            queryParams.append('limit', 20); // Limit to 20 results per page

            // Conditionally add userType and genre only if searchType is 'users'
            if (params.searchType === 'users') {
                if (params.userType) {
                    queryParams.append('userType', params.userType);
                }
                if (params.genre) {
                    queryParams.append('genre', params.genre);
                }
            }

            // Conditionally add date range only if searchType is 'events'
            if (params.searchType === 'events') {
                if (params.startDate) {
                    queryParams.append('startDate', params.startDate);
                }
                if (params.endDate) {
                    queryParams.append('endDate', params.endDate);
                }
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/search?${queryParams.toString()}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const { results, totalPages } = await response.json();
            setResults(results);
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Search error:", error.message);
            setResults([]);
        }
    };

    const handlePageChange = async (newPage) => {
        setCurrentPage(newPage);
        await fetchSearchResults(submittedSearchParams, newPage); // Use the submitted search params
    };

    if (scenesError) {
        return <ErrorMessage>Failed to load scenes. Please try again later.</ErrorMessage>;
    }

    return (
        <div className='flex-[4_4_0] border border-gray-700 min-h-screen pt-16 md:pt-0'>
            <div className='flex flex-col'>
            <div className='flex gap-10 px-4 py-6 items-center'>
								<button onClick={() => navigate(-1)}>
									<FaArrowLeft className='w-4 h-4' />
								</button>
								<div className='flex flex-col'>
									<p className='font-bold text-lg'>Search The Scenes!</p>
								</div>
							</div>
            {loadingScenes ? (
                <LoadingSpinner />
            ) : (
                <div className='flex flex-col px-4'>
                <SearchForm onSubmit={handleSearchSubmit}>
                    <Select 
                        name='scene' 
                        onChange={handleSearchChange} 
                        value={searchParams.scene}
                        required
                    >
                        <option value=''>Select Scene</option>
                        {Object.entries(organizedScenes).map(([state, scenes]) => (
                            <optgroup label={state} key={state}>
                                {scenes.map(scene => (
                                    <option key={scene._id} value={scene._id}>
                                        {scene.name}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </Select>

                    {searchParams.scene && (
                        <Select 
                            name='searchType' 
                            onChange={handleSearchChange} 
                            value={searchParams.searchType}
                            required
                        >
                            <option value=''>What are you searching for?</option>
                            <option value='users'>Users</option>
                            <option value='events'>Events</option>
                        </Select>
                    )}

                    {searchParams.searchType === 'users' && (
                        <>
                            <Select name='userType' onChange={handleSearchChange} value={searchParams.userType}>
                                <option value=''>Select User Type</option>
                                <option value='artist'>Artist</option>
                                <option value='fan'>Fan</option>
                            </Select>
                            {searchParams.userType === 'artist' && (
                                <Select name='genre' onChange={handleSearchChange} value={searchParams.genre}>
                                    <option value=''>Select Genre (Optional)</option>
                                    <option value="Metal">Metal</option>
                                    <option value="Rock">Rock</option>
                                    <option value="Pop">Pop</option>
                                    <option value="Country">Country</option>
                                    <option value="Blues">Blues</option>
                                    <option value="Hip Hop">Hip Hop</option>
                                    <option value="Electronic">Electronic</option>
                                    <option value="Jazz">Jazz</option>
                                    <option value="Folk">Folk</option>
                                    <option value="Other">Other</option>
                                </Select>
                            )}
                        </>
                    )}

                    {searchParams.searchType === 'events' && (
                        <>
                            <Input
                                type="date"
                                name="startDate"
                                value={searchParams.startDate}
                                onChange={handleSearchChange}
                                placeholder="Start Date"
                            />
                            <Input
                                type="date"
                                name="endDate"
                                value={searchParams.endDate}
                                onChange={handleSearchChange}
                                placeholder="End Date"
                            />
                        </>
                    )}

                    <SearchButton type='submit'>Search</SearchButton>
                </SearchForm>
                </div>
            )}

            {results && (
                <div className='flex flex-col px-4'>
                <Results>
                    {results.length > 0 ? (
                        results.map((result) => (
                            <ResultItem
                                to={submittedSearchParams.searchType === 'users' ? `/profile/${result.username}` : `/scenes/events/${result._id}`}
                                key={result._id}
                            >
                                <ResultContent>
                                    <Avatar>
                                        <img src={submittedSearchParams.searchType === 'users' ? (result.profileImg || "/avatar-placeholder.png") : (result.picture || "/event-placeholder.png")} alt="" />
                                    </Avatar>
                                    <Info>
                                        <Name>{submittedSearchParams.searchType === 'users' ? result.fullName : result.title}</Name>
                                        {submittedSearchParams.searchType === 'users' ? (
                                            <Details>@{result.username}</Details>
                                        ) : (
                                            <>
                                                <Details>{result.location}</Details>
                                                <Details>{result.genre}</Details>
                                            </>
                                        )}
                                    </Info>
                                </ResultContent>
                                <SceneInfo>
                                    {submittedSearchParams.searchType === 'users' ? (
                                        <FaLocationDot className="icon" />
                                    ) : (
                                        <FaCalendarDay className="icon" />
                                    )}
                                    <SceneText>{submittedSearchParams.searchType === 'users' ? result.sceneName : new Date(result.eventDate).toLocaleDateString()}</SceneText>
                                </SceneInfo>
                            </ResultItem>
                        ))
                    ) : (
                        <NoResults>No results found.</NoResults>
                    )}
                </Results>
                </div>
            )}

            {totalPages > 1 && (
                <Pagination>
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <PaginationButton
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            active={index + 1 === currentPage}
                        >
                            {index + 1}
                        </PaginationButton>
                    ))}
                </Pagination>
            )}
            </div>
        </div>
    );
};

// Styled components

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
`;

const PaginationButton = styled.button`
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    border: none;
    background-color: ${({ active }) => (active ? '#9a86f3' : '#2c2c2c')};
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${({ active }) => (active ? '#7b67d3' : '#444')};
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #1a1a1a;
    color: white;
    min-height: 100vh;
    padding: 2rem;
    border: 1px solid #333;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    color: white;
    font-size: 1.25rem;
    cursor: pointer;
    margin-right: 1rem;
`;

const Title = styled.h1`
    font-size: 1.5rem;
    font-weight: bold;
`;

const SearchForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
`;

const Select = styled.select`
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid #444;
    background-color: #2c2c2c;
    color: white;
    font-size: 1rem;
    outline: none;

    &:focus {
        border-color: #9a86f3;
    }
`;

const Input = styled.input`
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid #444;
    background-color: #2c2c2c;
    color: white;
    font-size: 1rem;
    outline: none;

    &:focus {
        border-color: #9a86f3;
    }
`;

const SearchButton = styled.button`
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: none;
    background-color: #9a86f3;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #7b67d3;
    }
`;

const Results = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const ResultItem = styled(Link)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #2c2c2c;
    padding: 1rem;
    border-radius: 0.5rem;
    text-decoration: none;
    color: white;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #3a3a3a;
    }
`;

const ResultContent = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const Avatar = styled.div`
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const Info = styled.div`
    display: flex;
    flex-direction: column;
`;

const Name = styled.span`
    font-weight: bold;
    font-size: 1rem;
`;

const Details = styled.span`
    color: #bbb;
    font-size: 0.875rem;
`;

const SceneInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .icon {
        font-size: 1.25rem;
        color: #9a86f3;
    }
`;

const SceneText = styled.h3`
    font-size: 1rem;
`;

const NoResults = styled.p`
    text-align: center;
    font-size: 1.25rem;
    color: #bbb;
`;

const ErrorMessage = styled.p`
    text-align: center;
    font-size: 1.25rem;
    color: red;
`;

export default SearchPage;
