'use client';
import { StudentDataItem } from '@/types/student';
import React, { createContext, useState, useContext } from 'react';

interface StudentsContextProps {
  selectedStudent: StudentDataItem | null;
  setSelectedStudent: (student: StudentDataItem | null) => void;
}

const StudentsContext = createContext<StudentsContextProps>({
  selectedStudent: null,
  setSelectedStudent: () => {},
});

export const StudentsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedStudent, setSelectedStudentState] =
    useState<StudentDataItem | null>(null);

  const setSelectedStudent = (student: StudentDataItem | null) => {
    setSelectedStudentState(student);
  };

  return (
    <StudentsContext.Provider
      value={{
        selectedStudent,
        setSelectedStudent,
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
};

export const useStudentsContext = () => useContext(StudentsContext);
