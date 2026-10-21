import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import "../assets/styles/custom.components.css";

const normalizeOptions = (options) =>
  options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );

export const CustomSelector = ({
  options = [],
  className = "",
  value,
  onChange,
  name,
  disabled = false,
  "aria-label": ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [menuPosition, setMenuPosition] = useState(null);
  const selectorId = useId();
  const optionsId = `custom-selector-options-${selectorId}`;
  const selectorRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const optionRefs = useRef([]);
  const normalizedOptions = normalizeOptions(options);
  const selectedIndex = normalizedOptions.findIndex(
    (option) => option.value === value,
  );
  const selectedOption = normalizedOptions[selectedIndex];

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      const clickedTrigger = selectorRef.current?.contains(event.target);
      const clickedMenu = menuRef.current?.contains(event.target);

      if (!clickedTrigger && !clickedMenu) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setMenuPosition(null);
      return undefined;
    }

    const updateMenuPosition = () => {
      const trigger = triggerRef.current;
      const menu = menuRef.current;

      if (!trigger || !menu) {
        return;
      }

      const triggerRect = trigger.getBoundingClientRect();
      const viewportPadding = 12;
      const gap = 9;
      const menuHeight = menu.scrollHeight;
      const spaceBelow = window.innerHeight - triggerRect.bottom - viewportPadding;
      const spaceAbove = triggerRect.top - viewportPadding;
      const openAbove = spaceBelow < Math.min(menuHeight + gap, 180)
        && spaceAbove > spaceBelow;
      const maxHeight = Math.max(100, (openAbove ? spaceAbove : spaceBelow) - gap);
      const width = Math.min(
        triggerRect.width,
        window.innerWidth - viewportPadding * 2,
      );
      const left = Math.min(
        Math.max(viewportPadding, triggerRect.left),
        window.innerWidth - width - viewportPadding,
      );

      setMenuPosition({
        left,
        top: openAbove
          ? Math.max(viewportPadding, triggerRect.top - Math.min(menuHeight, maxHeight) - gap)
          : triggerRect.bottom + gap,
        width,
        maxHeight,
      });
    };

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      optionRefs.current[focusedIndex]?.focus();
    }
  }, [isOpen, focusedIndex]);

  const openMenu = (index = selectedIndex >= 0 ? selectedIndex : 0) => {
    if (!normalizedOptions.length) {
      return;
    }

    setFocusedIndex(index);
    setIsOpen(true);
  };

  const closeMenu = (restoreTriggerFocus = false) => {
    setIsOpen(false);

    if (restoreTriggerFocus) {
      triggerRef.current?.focus();
    }
  };

  const chooseOption = (option) => {
    if (option.disabled) {
      return;
    }

    onChange?.({
      target: {
        name,
        value: option.value,
      },
    });
    closeMenu(true);
  };

  const moveFocus = (direction) => {
    if (!normalizedOptions.length) {
      return;
    }

    const currentIndex = isOpen
      ? focusedIndex
      : selectedIndex >= 0
        ? selectedIndex
        : 0;
    let nextIndex = currentIndex;

    for (let attempt = 0; attempt < normalizedOptions.length; attempt += 1) {
      nextIndex =
        (nextIndex + direction + normalizedOptions.length) %
        normalizedOptions.length;

      if (!normalizedOptions[nextIndex].disabled) {
        break;
      }
    }

    setFocusedIndex(nextIndex);
    setIsOpen(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(-1);
      return;
    }

    if (event.key === "Home" && isOpen) {
      event.preventDefault();
      openMenu(0);
      return;
    }

    if (event.key === "End" && isOpen) {
      event.preventDefault();
      openMenu(normalizedOptions.length - 1);
      return;
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    if (
      isOpen &&
      (event.key === "Enter" || event.key === " ") &&
      event.target.getAttribute("role") === "option"
    ) {
      event.preventDefault();
      chooseOption(normalizedOptions[focusedIndex]);
    }
  };

  return (
    <div
      ref={selectorRef}
      className={`custom-selector${isOpen ? " is-open" : ""}${className ? ` ${className}` : ""}`}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        className="custom-selector__trigger"
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={optionsId}
        disabled={disabled}
        onClick={() => {
          if (isOpen) {
            closeMenu();
          } else {
            openMenu();
          }
        }}
      >
        <span>{selectedOption?.label || "Select an option"}</span>
        <ChevronDown
          className="custom-selector__chevron"
          size={20}
          aria-hidden="true"
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="custom-selector__menu"
            id={optionsId}
            role="listbox"
            aria-label={ariaLabel || "Options"}
            style={menuPosition || undefined}
          >
            {normalizedOptions.map((option, index) => (
              <div
                key={option.value}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                className={`custom-selector__option${index === selectedIndex ? " is-selected" : ""}`}
                id={`${optionsId}-option-${index}`}
                role="option"
                aria-selected={index === selectedIndex}
                aria-disabled={option.disabled || undefined}
                tabIndex={-1}
                onFocus={() => setFocusedIndex(index)}
                onClick={(event) => {
                  event.preventDefault();
                  chooseOption(option);
                }}
              >
                <span>{option.label}</span>
                {index === selectedIndex && (
                  <Check size={20} aria-hidden="true" />
                )}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
};
