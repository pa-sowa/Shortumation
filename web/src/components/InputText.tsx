import { useToolTip } from "../tooltip/context";
import InputWrapper from "./InputWrapper";

export interface Props {
    textBoxFor?: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    additionalTooltipFilters?: Record<string, string>;
}
export default function InputText({
    label, 
    textBoxFor, 
    value="", 
    onChange,
    additionalTooltipFilters={},
}: Props) {
    const tooltip = useToolTip();
    return <InputWrapper label={label}>
        <input 
            value={value} 
            onChange={e => {
                e.preventDefault();
                onChange(e.target.value)
            }} 
            onFocus={e => textBoxFor && tooltip.setFocus(
                e.target.getBoundingClientRect(),
                {
                    searchObject: textBoxFor,
                    textInput: value,
                    filterObjects: additionalTooltipFilters,
                },
                onChange
            )}
        />
    </InputWrapper>
}