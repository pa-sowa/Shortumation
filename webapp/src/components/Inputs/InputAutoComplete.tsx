import "./InputAutoComplete.css";
import { Option } from "haService";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { Badge } from "@mui/material";
import { SearchItem } from "./extras";

export type InputAutoCompleteProps<T extends Option<any>> = {
  className?: string;
  validateOption?: (v: string[]) => string[] | null;
  groupBy?: (opt: T) => string;
  options: T[];
  getLabel?: (opt: T) => string;
  getID?: (opt: T) => string;
  helperText?: string;
} & InputAutoCompletePropsBase;

export type InputAutoCompletePropsBase = {
  label?: string;
} & (
  | {
      value: string | null;
      multiple?: false;
      onChange: (v: string | null) => void;
    }
  | {
      value: string | string[];
      multiple: true;
      onChange: (v: string[]) => void;
    }
);

export function InputAutoComplete<T extends Option>(
  props: InputAutoCompleteProps<T>
) {
  // aliases
  const getID = (opt: T): string => {
    if (props.getID) {
      return props.getID(opt);
    }
    if (typeof opt === "string") {
      return opt;
    }
    return opt.id;
  };
  const getLabel = (opt: T): string => {
    if (props.getLabel) {
      return props.getLabel(opt);
    }
    if (typeof opt === "string") {
      return opt;
    }
    return opt.label;
  };
  // processing of inputs
  const value = Array.isArray(props.value)
    ? props.value
    : !!props.value
    ? [props.value]
    : [];
  const errors = props.validateOption ? props.validateOption(value) : null;
  const options = props.options.sort((a, b) => {
    return getID(a) > getID(b) ? 1 : -1;
  });

  // processing of errors
  let helperText = props.helperText ?? <></>;
  let error: boolean = false;
  if (errors !== null) {
    error = true;
    if (errors.length > 0) {
      helperText = (
        <Badge
          className="input-autocomplete--errors"
          badgeContent={errors.length}
          color="error"
        >
          <ul title={errors.join(", and")}>
            {errors.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </Badge>
      );
    }
  }
  // events
  const onChange = (_e: any, v: any) => {
    const cleanValue: string[] =
      v === null
        ? []
        : Array.isArray(v)
        ? v.map((opt) => {
            if (typeof opt === "string") {
              return opt;
            }
            return opt.id;
          })
        : [v];
    if (props.multiple) {
      props.onChange(cleanValue);
    } else {
      props.onChange(cleanValue[cleanValue.length - 1]);
    }
  };

  return (
    <Autocomplete
      className={["input-autocomplete", props.className ?? ""].join(" ")}
      multiple={true}
      freeSolo
      value={value}
      options={options}
      onChange={onChange}
      getOptionLabel={getLabel as any}
      filterOptions={(opts, s) => {
        const searchTerm = s.inputValue.toLocaleLowerCase().trim();
        if (!searchTerm) {
          return opts;
        }
        return opts
          .map((opt) => {
            let similarityScore = 0;
            const eid = getID(opt);
            if (eid.toLocaleLowerCase().includes(searchTerm)) {
              similarityScore = Math.abs(eid.length - searchTerm.length);
            }
            const name = getLabel(opt);
            if (name.toLocaleLowerCase().includes(searchTerm)) {
              similarityScore = Math.abs(eid.length - searchTerm.length);
            }
            return {
              label: name,
              id: eid,
              domain: typeof opt === "string" ? "" : (opt as any).domain,
              similarityScore,
            };
          })
          .filter((opt) => opt.similarityScore > 0)
          .sort((a, b) => {
            return a.similarityScore > b.similarityScore ? 1 : -1;
          }) as any;
      }}
      groupBy={props.groupBy}
      renderOption={(listProps, option, { inputValue }) => {
        const label = getLabel(option);
        const id = getID(option);

        return (
          <SearchItem
            key={label + id}
            listProps={listProps}
            id={id}
            label={label}
            searchTerm={inputValue}
          />
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          label={props.label ?? "Entity ID"}
          helperText={helperText}
          error={error}
        />
      )}
      renderTags={(tagValue, getTagProps) => {
        const inner = (
          <div className="input-autocomplete--tags">
            {tagValue.map((option, index) => {
              const label = getLabel(option);
              const id = getID(option);
              const tagProps = getTagProps({ index });
              tagProps.className += " input-autocomplete--chip";
              return (
                <Chip
                  size="medium"
                  label={
                    <>
                      {id === label ? <span>{label}</span> : <b>{label}</b>}
                      {id !== label && <small>{id}</small>}
                    </>
                  }
                  {...tagProps}
                />
              );
            })}
          </div>
        );
        if (props.multiple) {
          return (
            <Badge badgeContent={tagValue.length} color="info">
              {inner}
            </Badge>
          );
        } else {
          return inner;
        }
      }}
    />
  );
}
