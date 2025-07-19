export interface UserResponseDTO { // response da api
    id: string;
    username: string;
    role: 'EVALUATOR' | 'USER' | 'ADMIN';
    name: string;
    email: string;
    biography: string | null;
    skills: SkillResponseDTO[];
    certificates: CertificateResponseDTO[];
    profilePicture: UserProfilePicture | null;
    linkedin: string | null;
    github: string | null;
    instagram: string | null;
    site: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface SkillResponseDTO {
    id: string;
    name: string;
    description: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    updatedAt: string;
}

export interface CertificateResponseDTO {
    id: string;
    name: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED';
    user: UserSimpleDTO;
    requiredSkills: SkillResponseDTO[];
    blobName: string;
    createdAt: string | null;
    updatedAt: string;
}

export interface UserSimpleDTO {
    id: string;
    name: string;
    username: string;
    email: string;
}

export interface UserProfileDTO {
    id: string;
    username: string,
    profilePictureBlobName: string,
    name: string,
    email: string,
    github: string,
    linkedin: string,
    site: string
}

export interface UserProfilePicture {
    id: string;
    blobName: string;
}