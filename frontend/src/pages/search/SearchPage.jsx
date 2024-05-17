import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SearchPage = (authUser) => {
    const [searchParams, setSearchParams] = useState({
        scene: '',  
        searchType: 'posts',
        userType: '',
        genre: '',
        postType: '',
    });

    const { username } = useParams(); // Example of how we might dynamically change queries

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['search', searchParams],
        queryFn: async () => {
            const queryParams = new URLSearchParams(searchParams).toString();
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/search?${queryParams}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
        enabled: !!authUser // Ensuring the query is enabled only if authUser exists
    });

    useEffect(() => {
        if (authUser) {
            // Dynamically setting scene based on authUser, if relevant
            setSearchParams(prev => ({ ...prev, scene: authUser.sceneId }));
        }
    }, [authUser]);

    const handleSearchChange = (e) => {
        setSearchParams(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (isError && error instanceof Error) {
        console.error("Search error:", error.message);
    }

    return (
        <div className='flex-[4_4_0] border border-gray-700 min-h-screen pt-16 md:pt-0'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Search The Scenes</p>
				</div>
				{isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <form onSubmit={(e) => e.preventDefault()}>
                        <select name='searchType' onChange={handleSearchChange} defaultValue='posts'>
                            <option value='posts'>Posts</option>
                            <option value='users'>Users</option>
                        </select>
                        {searchParams.searchType === 'users' && (
                            <>
                                <select name='userType' onChange={handleSearchChange}>
                                    <option value=''>Select User Type</option>
                                    <option value='artist'>Artist</option>
                                    <option value='fan'>Fan</option>
                                </select>
                                {searchParams.userType === 'artist' && (
                                    <select name='genre' onChange={handleSearchChange}>
                                        <option value=''>Select Genre</option>
                                        <option value='rock'>Rock</option>
                                        <option value='pop'>Pop</option>
                                        <option value='jazz'>Jazz</option>
                                    </select>
                                )}
                            </>
                        )}
                        <button type='submit'>Search</button>
                    </form>
                )}
                {data && (
                    <div className='results'>
                        {data.map((item, index) => (  // Using index as key if item.id is not guaranteed to be unique
                            <div key={item.id || index} className='item'>
                                <Link to={`/${item.type}/${item.id}`}>
                                    {item.name || item.title}
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
			</div>
    );
};

export default SearchPage;