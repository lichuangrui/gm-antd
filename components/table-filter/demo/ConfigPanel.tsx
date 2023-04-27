import React, { useEffect } from 'react';
import type { FC } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { FormInstance } from '../../index';
import { Cascader, Button, Form, Input, Select, Space } from '../../index';

const api: any = {};
// @ts-ignore
const r = require.context('gm_api/src', true, /.*\/(index\.ts|methods\.ts|types_schema\.json)$/);
r.keys().forEach((key: string) => {
  const module = key.split('/')[1];
  // eslint-disable-next-line compat/compat
  api[module] = Object.assign(api[module] || {}, r(key));
});

interface ConfigPanelProps {
  form: FormInstance<any>;
}

const ConfigPanel: FC<ConfigPanelProps> = ({ form }) => {
  const selectedAPI = Form.useWatch('selectedAPI', form);

  const types = ['input', 'select', 'date', 'cascader'].map(s => ({ value: s, label: s }));

  const options = React.useMemo(() => {
    const modules = Object.keys(api);
    return modules.map(moduleName => ({
      value: moduleName,
      label: moduleName,
      children: Object.keys(api[moduleName])
        .filter(method => /^(List|Get)/.test(method))
        .map((method: string) => ({
          value: method,
          label: method,
        })),
    }));
  }, []);
  const definitions: Array<{
    value: string;
    label: string;
    origin: { description: string; type: string };
  }> = React.useMemo(() => {
    if (!selectedAPI || selectedAPI.length !== 2) return [];
    const definition = api[selectedAPI[0]].definitions?.[`${selectedAPI[1]}Request`]?.properties;
    // eslint-disable-next-line compat/compat
    return Object.entries(definition)
      .filter(item => !item[0].startsWith('_'))
      .map(([key, value]: any) => ({
        value: key,
        label: `${key}(${value.description || '-'})`,
        origin: value,
      }));
  }, [selectedAPI]);

  useEffect(() => {
    const apiMethod =
      api[selectedAPI?.[0]]?.[selectedAPI?.[1]] || (async (params: any) => console.log(params));
    form.setFieldValue('apiMethod', apiMethod);
  }, [selectedAPI]);

  return (
    <Form form={form}>
      <Form.Item name="selectedAPI" label="选择接口" rules={[{ required: true }]}>
        <Cascader
          options={options}
          placeholder="请选择接口"
          expandTrigger="hover"
          showSearch={{
            filter: (inputValue, path) =>
              path.some(
                option =>
                  (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
              ),
          }}
        />
      </Form.Item>
      <Form.List name="fields">
        {(fields, { add, remove }) => (
          <>
            {fields.map(field => (
              <Space key={field.key} align="baseline" style={{ width: '100%' }}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, curValues) => prevValues.api !== curValues.api}
                >
                  {() => (
                    <Form.Item
                      {...field}
                      label="key"
                      name={[field.name, 'key']}
                      rules={[{ required: true }]}
                    >
                      <Select
                        disabled={!form.getFieldValue('selectedAPI')}
                        options={definitions}
                        dropdownMatchSelectWidth={false}
                        onChange={value => {
                          const definition = definitions.find(d => d.value === value)!;
                          form.setFieldValue(
                            ['fields', field.name, 'label'],
                            definition.origin.description,
                          );
                          form.setFieldValue(['fields', field.name, 'type'], 'input');
                        }}
                        style={{ width: 130 }}
                      />
                    </Form.Item>
                  )}
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, curValues) => prevValues.api !== curValues.api}
                >
                  {() => (
                    <Form.Item
                      {...field}
                      label="label"
                      name={[field.name, 'label']}
                      rules={[{ required: true }]}
                    >
                      <Input disabled={!form.getFieldValue('selectedAPI')} style={{ width: 130 }} />
                    </Form.Item>
                  )}
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, curValues) => prevValues.api !== curValues.api}
                >
                  {() => (
                    <Form.Item
                      {...field}
                      label="type"
                      name={[field.name, 'type']}
                      rules={[{ required: true }]}
                    >
                      <Select
                        disabled={!form.getFieldValue('selectedAPI')}
                        style={{ width: 130 }}
                        options={types}
                      />
                    </Form.Item>
                  )}
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(field.name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() =>
                  add({
                    key: '',
                    label: '字段名',
                    type: 'input',
                    alwaysUsed: true,
                  })
                }
                block
                icon={<PlusOutlined />}
              >
                增加字段
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};
export default ConfigPanel;
