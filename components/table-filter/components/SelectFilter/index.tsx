import type { FC, HTMLAttributes } from 'react';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { debounce, groupBy } from 'lodash';
import type { FieldSelectItem, SelectOptions } from '../../types';
import TableFilterContext from '../../context';
import Select from '../../../select';

export interface SelectFilterProps extends HTMLAttributes<HTMLDivElement> {
  field: FieldSelectItem;
}

const { Option, OptGroup } = Select;

const SelectFilter: FC<SelectFilterProps> = ({ className, field }) => {
  const { multiple, options: originOptions, placeholder, remote, label } = field;
  const store = useContext(TableFilterContext);
  const first = useRef(true);
  const [searchValue, setSearchValue] = useState('');
  const [options, setOptions] = useState(Array.isArray(originOptions) ? originOptions : []);
  const groups = groupBy(options, item => item.group);

  const value = store.get(field);

  const fetch = useMemo(() => {
    function fetch() {
      if (!originOptions) return setOptions([]);
      if (Array.isArray(originOptions)) setOptions(originOptions);
      if (typeof originOptions !== 'function') return;
      const res: any = originOptions(searchValue || undefined);
      if (res.then) {
        res.then((data: SelectOptions) => setOptions(data));
      } else {
        setOptions(res);
      }
    }
    return debounce(fetch, 300);
  }, [originOptions]);

  useEffect(() => {
    if (first.current) {
      fetch();
      first.current = false;
    } else if (remote) {
      fetch();
    }
  }, [originOptions, searchValue]);

  return (
    <Select
      className={classNames(className)}
      style={{ width: '100%' }}
      bordered={false}
      mode={multiple ? 'multiple' : undefined}
      maxTagCount="responsive"
      placeholder={placeholder || `请选择${label}`}
      value={options.length ? value : undefined}
      onChange={value => {
        const oldValue = store.get(field);
        let val: typeof value | undefined = value;
        if (typeof val === 'string' || typeof val === 'number') {
          if (val === '') val = undefined;
        } else if (Array.isArray(val)) {
          if (val.length === 0) val = undefined;
        }
        store.set(field, value);
        if (['onChange', 'both'].includes(store.trigger!) && value !== oldValue) {
          store.search();
        }
      }}
      searchValue={searchValue}
      onSearch={val => setSearchValue(val?.trim())}
      showSearch
      optionFilterProp="children"
      allowClear
      dropdownMatchSelectWidth={false}
      // dropdownAlign={{ offset: [-10, 2] }}
      filterOption={(input, option) =>
        (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
      }
      onFocus={() => {
        store.focusedFieldKey = field.key;
      }}
      // @ts-ignore
      onBlurCapture={() => {
        store.focusedFieldKey = '';
      }}
    >
      {Object.keys(groups).length < 2 &&
        options.map(item => (
          <Option key={item.value} value={item.value}>
            {item.text}
          </Option>
        ))}
      {Object.keys(groups).length >= 2 &&
        Object.keys(groups).map((groupName = '默认分组') => {
          const list = groups[groupName];
          if (!list.length) return null;
          return (
            <OptGroup key={groupName} label={groupName}>
              {list.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>
              ))}
            </OptGroup>
          );
        })}
    </Select>
  );
};
export default observer(SelectFilter);
