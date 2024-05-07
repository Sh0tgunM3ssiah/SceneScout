import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
		userType: "",  // Added userType state
		sceneId: "",
		sceneName: "",
	});
	const [showPassword, setShowPassword] = useState(false);

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

	const queryClient = useQueryClient();

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

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, fullName, password, userType, sceneId, sceneName }) => {
			try {
				const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
					method: "POST",
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ email, username, fullName, password, userType, sceneId, sceneName }),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to create account");
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Account created successfully");
			navigate(from);
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault(); // page won't reload
		mutate(formData);
	};

	const handleInputChange = (e) => {
		const { name, value, options, selectedIndex } = e.target;
		if (name === "sceneId") {
			const sceneName = options[selectedIndex].getAttribute('data-scenename');
			setFormData({ ...formData, sceneId: value, sceneName: sceneName });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<img
					src="/mastiffLogo.png"
					alt="Kylo"
					style={{
						cursor: "pointer",
					}}
				/>
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<img
						src="/scenescoutLogoScript.png"
						alt="SceneScout Logo"
						style={{
							cursor: "pointer",
							minWidth: "200px",
							maxWidth: "250px"
						}}
					/>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>
					<div className='flex gap-4 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='Username'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow'
								placeholder='Full Name'
								name='fullName'
								onChange={handleInputChange}
								value={formData.fullName}
							/>
						</label>
					</div>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type={showPassword ? 'text' : 'password'}
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}  // Toggle the showPassword state
							className="btn btn-ghost"
						>
							{showPassword ? 'Hide' : 'Show'}
						</button>
					</label>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<select
							name="userType"
							onChange={handleInputChange}
							value={formData.userType}
							className="grow transparent-select"
						>
							<option value="">Select User Type</option>
							<option value="fan">Fan</option>
							<option value="artist">Artist</option>
						</select>
					</label>
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
					{loadingScenes && <p>Loading scenes...</p>}
					{errorScenes && <p className='text-red-500'>{errorScenes}</p>}
					<button className='btn rounded-full btn-primary text-white'>
						{isPending ? "Loading..." : "Sign up"}
					</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg'>Already have an account?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;
