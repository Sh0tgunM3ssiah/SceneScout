const SearchPage = ({ authUser }) => {
    const [searchParams, setSearchParams] = useState({
        scene: '',  
        searchType: 'posts',
        userType: '',
        genre: '',
    });

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
        enabled: !!authUser && !!searchParams.scene // Ensure query is enabled only if authUser and scene are selected
    });

    const handleSearchChange = (e) => {
        setSearchParams(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className='flex-[4_4_0] border border-gray-700 min-h-screen pt-16 md:pt-0'>
            <div className='flex justify-between items-center p-4 border-b border-gray-700'>
                <p className='font-bold'>Search The Scenes</p>
            </div>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <form onSubmit={(e) => e.preventDefault()}>
                    <select name='scene' onChange={handleSearchChange} required>
                        <option value=''>Select Scene</option>
                        {/* Add scene options here */}
                        <option value='scene1'>Scene 1</option>
                        <option value='scene2'>Scene 2</option>
                    </select>

                    <select name='searchType' onChange={handleSearchChange} defaultValue='posts'>
                        <option value='posts'>Posts</option>
                        <option value='users'>Users</option>
                        <option value='events'>Events</option>
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
                    {data.map((item, index) => (
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
