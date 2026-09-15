"use client";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export type CloseModal = (afterClose?: () => void) => void;
type ModalContent = ReactNode | ((close: CloseModal) => ReactNode);

function ModalSection({
  content,
  onRequestClose,
}: {
  content: ModalContent;
  onRequestClose: CloseModal;
}) {
  return typeof content === "function" ? content(onRequestClose) : content;
}

export function Modal({
  title,
  children,
  onClose,
  wide = false,
  footer,
  side = "right",
  className = "",
}: {
  title: string;
  children: ModalContent;
  onClose: () => void;
  wide?: boolean;
  footer?: ModalContent;
  side?: "left" | "right";
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);
  const closeStarted = useRef(false);
  const finished = useRef(false);
  const afterClose = useRef<(() => void) | undefined>(undefined);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const router = useRouter();

  useLayoutEffect(() => {
    const dialog = ref.current;
    const active = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const oldOverflow = root.style.overflow;
    const { scrollX, scrollY } = window;
    root.style.overflow = "hidden";
    dialog?.showModal();
    // Native dialog focus must not move the product page behind the drawer.
    window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
    return () => {
      clearTimeout(timer.current);
      dialog?.close();
      root.style.overflow = oldOverflow;
      if (active?.isConnected) active.focus({ preventScroll: true });
    };
  }, []);

  function finishClose() {
    if (finished.current) return;
    finished.current = true;
    clearTimeout(timer.current);
    onClose();
    afterClose.current?.();
  }
  const close: CloseModal = (next) => {
    if (closeStarted.current) return;
    closeStarted.current = true;
    afterClose.current = next;
    setClosing(true);
    // Fallback for a cancelled animation, e.g. a changed motion preference.
    timer.current = setTimeout(finishClose, 400);
  };

  return (
    <dialog
      ref={ref}
      className={`modal modal-${side}${wide ? " wide" : ""}${closing ? " is-closing" : ""} ${className}`}
      aria-label={title}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && closing) finishClose();
      }}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      onClickCapture={(event) => {
        const link = (event.target as Element).closest<HTMLAnchorElement>(
          "a[href]",
        );
        if (
          !link ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          link.target === "_blank" ||
          link.hasAttribute("download")
        )
          return;
        const url = new URL(link.href);
        if (url.origin !== window.location.origin) return;
        event.preventDefault();
        event.stopPropagation();
        const href = url.pathname + url.search + url.hash;
        router.prefetch(href);
        close(() => router.push(href));
      }}
    >
      <div className="modal-inner">
        <div className="modal-heading">
          <h2>{title}</h2>
          <button
            type="button"
            className="icon-button"
            aria-label="Close dialog"
            title="Close"
            autoFocus
            onClick={() => close()}
          >
            <X />
          </button>
        </div>
        <div className="modal-content">
          <ModalSection content={children} onRequestClose={close} />
        </div>
        {footer && (
          <div className="modal-footer">
            <ModalSection content={footer} onRequestClose={close} />
          </div>
        )}
      </div>
    </dialog>
  );
}
