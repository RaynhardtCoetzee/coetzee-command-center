'use client';

import { useRouter } from 'next/navigation';
import { ProjectForm } from '@/components/projects/project-form';

export default function NewProjectPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/projects');
  };

  const handleCancel = () => {
    router.push('/projects');
  };

  return (
    <div className="space-y-6 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Project Form Dialog */}
      <ProjectForm
        project={null}
        open={true}
        onOpenChange={(open) => {
          if (!open) {
            handleCancel();
          }
        }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
