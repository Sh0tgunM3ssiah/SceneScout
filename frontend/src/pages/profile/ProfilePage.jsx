import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import FollowingList from "../../components/common/FollowingList";

import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft, FaBriefcase, FaMusic } from "react-icons/fa6";
import { IoCalendarOutline, IoLocationOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date";

import useFollow from "../../hooks/useFollow";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const ProfilePage = () => {
	const [coverImg, setCoverImg] = useState(null);
	const [profileImg, setProfileImg] = useState(null);
	const navigate = useNavigate();
	const [feedType, setFeedType] = useState("posts");

	const coverImgRef = useRef(null);
	const profileImgRef = useRef(null);

	const { username } = useParams();

	const { follow, isPending } = useFollow();
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const {
		data: user,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["userProfile"],
		queryFn: async () => {
			try {
				const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile/${username}`,{
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
	});

	const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();

	const isMyProfile = authUser._id === user?._id;
	const memberSinceDate = formatMemberSinceDate(user?.createdAt);
	const amIFollowing = authUser?.following.includes(user?._id);

	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				state === "coverImg" && setCoverImg(reader.result);
				state === "profileImg" && setProfileImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	useEffect(() => {
		refetch();
	}, [username, refetch]);

	return (
		<>
			<div className='flex-[4_4_0] border border-gray-700 min-h-screen pt-16 md:pt-0'>
				{/* HEADER */}
				{(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
				{!isLoading && !isRefetching && !user && <p className='text-center text-lg mt-4'>User not found</p>}
				<div className='flex flex-col'>
					{!isLoading && !isRefetching && user && (
						<>
							<div className='flex gap-10 px-4 py-2 items-center'>
								<button onClick={() => navigate(-1)}>
									<FaArrowLeft className='w-4 h-4' />
								</button>
								<div className='flex flex-col'>
									<p className='font-bold text-lg'>{user?.fullName}</p>
									<span className='text-sm text-slate-500'>{user?.sceneName} {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}</span>
								</div>
							</div>
							{/* COVER IMG */}
							<div className='relative group/cover'>
								<img
									src={coverImg || user?.coverImg || "/cover.png"}
									className='h-52 w-full object-cover'
									alt='cover image'
								/>
								{isMyProfile && (
									<div
										className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
										onClick={() => coverImgRef.current.click()}
									>
										<MdEdit className='w-5 h-5 text-white' />
									</div>
								)}

								<input
									type='file'
									hidden
									accept='image/*'
									ref={coverImgRef}
									onChange={(e) => handleImgChange(e, "coverImg")}
								/>
								<input
									type='file'
									hidden
									accept='image/*'
									ref={profileImgRef}
									onChange={(e) => handleImgChange(e, "profileImg")}
								/>
								{/* USER AVATAR */}
								<div className='avatar absolute -bottom-16 left-4'>
									<div className='w-32 rounded-full relative group/avatar'>
										<img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} />
										<div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
											{isMyProfile && (
												<MdEdit
													className='w-4 h-4 text-white'
													onClick={() => profileImgRef.current.click()}
												/>
											)}
										</div>
									</div>
								</div>
							</div>
							<div className='flex justify-end px-4 mt-5'>
								{isMyProfile && <EditProfileModal authUser={authUser} />}
								{!isMyProfile && (
									<button
										className='btn btn-outline rounded-full btn-sm'
										onClick={() => follow(user?._id)}
									>
										{isPending && "Loading..."}
										{!isPending && amIFollowing && "Unfollow"}
										{!isPending && !amIFollowing && "Follow"}
									</button>
								)}
								{(coverImg || profileImg) && (
									<button
										className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
										onClick={async () => {
											await updateProfile({ coverImg, profileImg });
											setProfileImg(null);
											setCoverImg(null);
										}}
									>
										{isUpdatingProfile ? "Updating..." : "Update"}
									</button>
								)}
							</div>

							<div className='flex flex-col gap-4 mt-14 px-4'>
								<div className='flex flex-col'>
									<span className='font-bold text-lg'>{user?.fullName}</span>
									<span className='text-sm text-slate-500'>@{user?.username}</span>
									<span className='text-sm my-1'>{user?.bio}</span>
								</div>

								<div className='flex flex-col gap-2'>
									<div className='flex gap-2 items-center'>
										<FaBriefcase className='w-4 h-4 text-slate-500' />
										<span className='text-sm text-slate-500'>
											{user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
										</span>
										<IoLocationOutline className='w-4 h-4 text-slate-500' />
										<span className='text-sm text-slate-500'>{user.sceneName}</span>
									</div>
									{user?.genre && (
										<div className='flex gap-2 items-center'>
											<FaMusic className="w-4 h-4 text-slate-500" />
											<span className='text-sm text-slate-500'>{user.genre}</span>
										</div>
									)}
									{user?.link && (
										<div className='flex gap-1 items-center'>
											<FaLink className='w-3 h-3 text-slate-500' />
											<a
												href={user.link}
												target='_blank'
												rel='noreferrer'
												className='text-sm text-blue-500 hover:underline'
											>
												{user.link}
											</a>
										</div>
									)}
									<div className='flex gap-2 items-center'>
										<IoCalendarOutline className='w-4 h-4 text-slate-500' />
										<span className='text-sm text-slate-500'>{memberSinceDate}</span>
									</div>
								</div>
								<div className='flex gap-2'>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.following.length}</span>
										<span className='text-slate-500 text-xs'>Following</span>
									</div>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.followers.length}</span>
										<span className='text-slate-500 text-xs'>Followers</span>
									</div>
								</div>
							</div>
							<div className='flex w-full border-b border-gray-700 mt-4'>
								<div
									className={`flex justify-center flex-1 p-3 transition duration-300 relative cursor-pointer ${feedType === "posts" ? "bg-secondary" : ""}`}
									onClick={() => setFeedType("posts")}
								>
									Posts
									{feedType === "posts" && (
										<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
									)}
								</div>
								<div
									className={`flex justify-center flex-1 p-3 transition duration-300 relative cursor-pointer ${feedType === "likes" ? "bg-secondary" : ""}`}
									onClick={() => setFeedType("likes")}
								>
									Likes
									{feedType === "likes" && (
										<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
									)}
								</div>
								<div
									className={`flex justify-center flex-1 p-3 transition duration-300 relative cursor-pointer ${feedType === "following" ? "bg-secondary" : ""}`}
									onClick={() => setFeedType("following")}
								>
									Following
									{feedType === "following" && (
										<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
									)}
								</div>
							</div>
						</>
					)}

					{feedType === "following" ? (
						<FollowingList userId={user?._id} />
					) : (
						<Posts feedType={feedType} username={username} userId={user?._id} />
					)}
				</div>
			</div>
		</>
	);
};

export default ProfilePage;
