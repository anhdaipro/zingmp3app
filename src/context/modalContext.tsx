// ModalContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

interface ModalState {
  isOpen: boolean;
  content: ReactNode | null;
  height:string;
  
}

interface OpenModalProps {
  content: ReactNode;
  height?:string;
}

interface ModalActions {
  openModal: (props: OpenModalProps) => void;
  closeModal: () => void;
}

const ModalStateContext = createContext<ModalState | undefined>(undefined);
const ModalActionsContext = createContext<ModalActions | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    height:'md',
    content: null,
  });
  const openModal = useCallback(({ content, height='md' }: OpenModalProps) => {
    setModalState({
      isOpen: true,
      content,
      height:height
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const stateValue = useMemo(() => modalState, [modalState]);
  const actionsValue = useMemo(() => ({ openModal, closeModal }), [openModal, closeModal]);

  return (
    <ModalStateContext.Provider value={stateValue}>
      <ModalActionsContext.Provider value={actionsValue}>
        {children}
      </ModalActionsContext.Provider>
    </ModalStateContext.Provider>
  );
};

export const useModalState = (): ModalState => {
  const context = useContext(ModalStateContext);
  if (!context) {
    throw new Error("useModalState must be used within a ModalProvider");
  }
  return context;
};

export const useModalActions = (): ModalActions => {
  const context = useContext(ModalActionsContext);
  if (!context) {
    throw new Error("useModalActions must be used within a ModalProvider");
  }
  return context;
};