import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { FC } from "react";

type modelWrapperProps = {
  title?: string;
  content: string;
  openModal: boolean;
  closeBtnText?: string;
  onModalClose: (setIsModalActive: boolean) => void;
};

const ModalWrapper: FC<modelWrapperProps> = ({
  title = "Notification",
  content,
  openModal,
  closeBtnText = "Close",
  onModalClose,
}) => {
  return (
    <Modal
      isOpen={openModal}
      onClose={() => {
        onModalClose(false);
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <p>{content}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                {closeBtnText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalWrapper;
