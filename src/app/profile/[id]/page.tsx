'use client';
import '@/app/styles/globals.scss';
import '@/app/styles/profile/profileStyle.scss';
import { useTheme, useGetLoggedUser } from '@/app/hooks';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserResponseDTO } from '@/app/responses';
import { UserService } from '@/services/userService';
import axios from 'axios';

export default function Profile() {
    const theme = useTheme();
    const param = useParams();
    const router = useRouter();

    // AQUI ESTÁ A CORREÇÃO PRINCIPAL:
    // Desestruturamos o objeto retornado pelo hook.
    // A propriedade 'user' do hook é renomeada para a constante 'loggedUser'.
    const { user: loggedUser, isLoading } = useGetLoggedUser();

    const [userById, setUserById] = useState<UserResponseDTO | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        linkedin: '',
        github: '',
        instagram: '',
        site: '',
    });
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // CORRIGIDO: Agora 'loggedUser' é o objeto de usuário correto ou null.
    const isOwner = loggedUser && userById && loggedUser.id === userById.id;

    useEffect(() => {
        if (!param.id) return;

        const fetchProfileUser = async () => {
            try {
                const userId = Array.isArray(param.id) ? param.id[0] : param.id;
                const user = await UserService.getUserById(userId);
                setUserById(user);
                setFormData({
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    linkedin: user.linkedin || '',
                    github: user.github || '',
                    instagram: user.instagram || '',
                    site: user.site || '',
                });
            } catch {
                setUserById(null);
            }
        };

        fetchProfileUser();
    }, [param.id]);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    // Esta lógica de redirecionamento agora funcionará corretamente.
    useEffect(() => {
        if (isLoading) {
            return;
        }
        if (!isLoading && !loggedUser) {
            router.push('/auth');
        }
    }, [loggedUser, isLoading, router]);

    // O estado de carregamento agora funciona.
    if (isLoading) {
        return (
            <section className={`section ${theme}`}>
                <p>Verificando autenticação...</p>
            </section>
        );
    }

    // Esta verificação impede a renderização desnecessária antes do redirecionamento.
    if (!loggedUser) {
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        }
    };

    const handleSave = async () => {
        try {
            if (image) {
                const imgData = new FormData();
                imgData.append('file', image);
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/uploadProfileImg`, imgData, {
                    withCredentials: true,
                });
            }

            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/user`, formData, {
                withCredentials: true,
            });

            const userId = Array.isArray(param.id) ? param.id[0] : param.id;
            const updatedUser = await UserService.getUserById(userId);
            setUserById(updatedUser);
            setIsEditing(false);
            setImage(null);
            setPreview(null);
        } catch (err) {
            console.error('Erro ao salvar perfil:', err);
        }
    };

    // O restante do seu JSX não precisa de alterações.
    return (
        <section className={`section ${theme}`}>
            <div className="profile-container">
                <div className="profile-card">
                    <h1>{isOwner ? 'Seu Perfil' : `Perfil de ${userById?.name}`}</h1>

                    <img
                        src={
                            preview
                                ? preview
                                : userById?.profilePicture
                                    ? `${process.env.NEXT_PUBLIC_API_URL}/user/profilePicture/${userById.profilePicture.blobName}`
                                    : '/defaultPicture.jpg'
                        }
                        alt="Profile picture"
                        className="profile-img"
                    />

                    {isOwner && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={!isEditing}
                        />
                    )}

                    <div className="info-group">
                        <label>Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />

                        <label>Email</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>

                    {isOwner && (
                        <div className="edit-buttons">
                            {isEditing ? (
                                <>
                                    <button className="save" onClick={handleSave}>
                                        Salvar
                                    </button>
                                    <button className="cancel" onClick={() => setIsEditing(false)}>
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <button className="save" onClick={() => setIsEditing(true)}>
                                    Editar
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}