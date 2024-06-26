import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const EditProfileModal = ({ authUser }) => {
	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		sceneId: "",
		sceneName: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
		genre: "", // Add genre field
	});

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

	const [scenes, setScenes] = useState([]);
	const [loadingScenes, setLoadingScenes] = useState(false);
	const [errorScenes, setErrorScenes] = useState(null);

	useEffect(() => {
		const fetchScenes = async () => {
			setLoadingScenes(true);
			setErrorScenes(null);
			try {
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/scenes/`);
				const data = await response.json();
				if (!response.ok) throw new Error(data.message || "Failed to fetch scenes");
				setOrganizedScenes(organizeScenesByState(data));
			} catch (error) {
				setErrorScenes(error.message);
			} finally {
				setLoadingScenes(false);
			}
		};

		fetchScenes();
	}, []);

	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		if (name === "sceneId") {
			const sceneName = e.target.options[e.target.selectedIndex].getAttribute('data-scenename');
			setFormData({ ...formData, sceneId: value, sceneName });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	useEffect(() => {
		if (authUser) {
			setFormData({
				fullName: authUser.fullName || "",
				username: authUser.username || "",
				email: authUser.email || "",
				bio: authUser.bio || "",
				link: authUser.link || "",
				sceneId: authUser.sceneId || "",
				sceneName: authUser.sceneName || "",
				newPassword: "",
				currentPassword: "",
				genre: authUser.genre || "", // Initialize genre field
			});
		}
	}, [authUser]);

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData);
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Link'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.link}
								name='link'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>
						<textarea
							placeholder='Bio'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.bio}
							name='bio'
							onChange={handleInputChange}
						/>
						{authUser.userType === "artist" && ( // Conditionally render genre input
							<select
								name='genre'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.genre}
								onChange={handleInputChange}
							>
								<option value="">Select a Genre</option>
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
							</select>
						)}
						<label className='input input-bordered rounded flex items-center gap-2'>
							<select
								name="sceneId"
								onChange={handleInputChange}
								value={formData.sceneId}
								className="grow transparent-select"
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
						</label>
						<button className='btn btn-primary rounded-full btn-sm text-white'>
							{isUpdatingProfile ? "Updating..." : "Update"}
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};

export default EditProfileModal;