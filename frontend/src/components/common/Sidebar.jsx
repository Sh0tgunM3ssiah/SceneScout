import XSvg from "../svgs/X";
import { useState } from 'react';
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);
	const queryClient = useQueryClient();
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
					method: "POST",
					credentials: 'include',
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	return (
		<div>
			<div className='hidden md:flex flex-col md:flex-[2_2_0] w-18 max-w-52'>
				<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
					<Link to='/' className='flex justify-center md:justify-start md:pl-2'>
						<img
							src="/mastiffLogo.png"
							alt="Kylo"
							style={{
								cursor: "pointer",
								maxWidth:  "50px"
							}}
						/>
					</Link>
					<ul className='flex flex-col gap-3 mt-4'>
						<li className='flex justify-center md:justify-start'>
							<Link
								to='/'
								className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
							>
								<MdHomeFilled className='w-8 h-8' />
								<span className='text-lg hidden md:block'>Home</span>
							</Link>
						</li>
						<li className='flex justify-center md:justify-start'>
							<Link
								to='/notifications'
								className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
							>
								<IoNotifications className='w-6 h-6' />
								<span className='text-lg hidden md:block'>Notifications</span>
							</Link>
						</li>

						<li className='flex justify-center md:justify-start'>
							<Link
								to={`/profile/${authUser?.username}`}
								className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
							>
								<FaUser className='w-6 h-6' />
								<span className='text-lg hidden md:block'>Profile</span>
							</Link>
						</li>
						{/* <li className='flex justify-center md:justify-start'>
							<Link
								to={`/search`}
								className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
							>
								<FaSearch className='w-6 h-6' />
								<span className='text-lg hidden md:block'>Search</span>
							</Link>
						</li> */}
					</ul>
					{authUser && (
						<Link
							to={`/profile/${authUser.username}`}
							className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full'
						>
							<div className='avatar hidden md:inline-flex'>
								<div className='w-8 rounded-full'>
									<img src={authUser?.profileImg || "/avatar-placeholder.png"} />
								</div>
							</div>
							<div className='flex justify-between flex-1'>
								<div className='hidden md:block'>
									<p className='text-white font-bold text-sm w-20 truncate'>{authUser?.fullName}</p>
									<p className='text-slate-500 text-sm'>@{authUser?.username}</p>
								</div>
								<BiLogOut
									className='w-5 h-5 cursor-pointer'
									onClick={(e) => {
										e.preventDefault();
										logout();
									}}
								/>
							</div>
						</Link>
					)}
				</div>
			</div>
			{/* Mobile Navbar */}
			<div className='md:hidden fixed top-0 left-0 right-0 flex justify-between items-center px-4 py-2 z-50 border-b border-gray-700 bg-black'>
                <div className='flex-1 flex'>
                    <Link to='/' className='flex justify-center' onClick={closeMenu}>
                        <img
                            src="/mastiffLogo.png"
                            alt="Kylo"
                            style={{
                                cursor: "pointer",
                                maxWidth: "50px"
                            }}
                        />
                    </Link>
                </div>
                
                {/* Hamburger menu button */}
                <div className='flex items-center'>
                    <button className='hover:bg-gray-700 p-2 rounded-full' onClick={toggleMenu}>
                        <svg viewBox="0 0 100 80" width="40" height="40" fill="#FFF">
                            <rect width="100" height="10"></rect>
                            <rect y="30" width="100" height="10"></rect>
                            <rect y="60" width="100" height="10"></rect>
                        </svg>
                    </button>
                </div>
                
                {/* Menu items */}
                {isMenuOpen && (
                    <div className='absolute top-full right-0 bg-black shadow-md rounded-lg py-2 w-48'>
                        <Link to='/' className='block px-4 py-2 text-white hover:bg-stone-900' onClick={closeMenu}>Home</Link>
                        <Link to='/notifications' className='block px-4 py-2 text-white hover:bg-stone-900' onClick={closeMenu}>Notifications</Link>
                        <Link to={`/profile/${authUser?.username}`} className='block px-4 py-2 text-white hover:bg-stone-900' onClick={closeMenu}>Profile</Link>
                        {/* <Link to='/search' className='block px-4 py-2 text-white hover:bg-stone-900' onClick={closeMenu}>Search</Link> */}
                        <button className='text-white hover:bg-stone-900 block w-full text-left px-4 py-2' onClick={() => {
                            logout();
                            closeMenu();
                        }}>Logout</button>
                    </div>
                )}
            </div>
		</div>
	);
};
export default Sidebar;
