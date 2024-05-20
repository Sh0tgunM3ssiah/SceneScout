import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart, FaArrowLeft } from "react-icons/fa6";

const NotificationPage = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifications`, {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json'
					}
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifications`, {
					method: "DELETE",
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json'
					}
				});
				const data = await res.json();

				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Notifications deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
			<div className='flex-[4_4_0] border border-gray-700 min-h-screen pt-16 md:pt-0'>
				<div className="flex flex-col">
					<div className='flex gap-10 px-4 py-2 items-center border-b border-gray-700'>
						<button onClick={() => navigate(-1)}>
									<FaArrowLeft className='w-4 h-4' />
								</button>
						<p className='font-bold text-lg'>Notifications</p>
						<div className='dropdown '>
							<div tabIndex={0} role='button' className='m-1 pl-5'>
								<IoSettingsOutline className='w-4' />
							</div>
							<ul
								tabIndex={0}
								className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
							>
								<li>
									<a onClick={deleteNotifications}>Delete all notifications</a>
								</li>
							</ul>
						</div>
					</div>
					{isLoading && (
						<div className='flex justify-center h-full items-center'>
							<LoadingSpinner size='lg' />
						</div>
					)}
					{notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
					{notifications?.map((notification) => (
						<div className='border-b border-gray-700' key={notification._id}>
							<div className='flex gap-2 p-4'>
								{notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
								{notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
								<Link to={`/profile/${notification.from.username}`}>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={notification.from.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex gap-1'>
										<span className='font-bold'>@{notification.from.username}</span>{" "}
										{notification.type === "follow" ? "followed you" : "liked your post"}
									</div>
								</Link>
							</div>
						</div>
					))}
				</div>
			</div>
	);
};
export default NotificationPage;
