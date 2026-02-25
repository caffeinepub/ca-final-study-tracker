import React from 'react';

interface EditSubjectDialogProps {
  children: React.ReactNode;
}

// Stub: Subject schema has no editable progress fields; editing is handled at the chapter level.
export function EditSubjectDialog({ children }: EditSubjectDialogProps) {
  return <>{children}</>;
}
