/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Form as AntForm, Button, FormProps, FormItemProps } from "antd";
import { Store } from "antd/es/form/interface";
import Iconify from "../IconifyConfig/IconifyConfig";
import { useDispatch } from "react-redux";
import { closeModal } from "../../app/features/modalSlice";

interface Props<T> extends FormProps<T> {
  buttonLabel?: string;
  isLoading: boolean;
  isSuccess?: boolean;
  onFinish: (values: T) => void;
  children: React.ReactNode;
  defaultRecord?: any | undefined;
}

interface ItemProps<T> extends Omit<FormItemProps, "name" | "children"> {
  name: keyof T;
  label?: string | JSX.Element;
  rules?: FormItemProps["rules"];
  children: React.ReactNode;
}

const Form = <T extends Store>({
  buttonLabel = "Submit",
  isLoading,
  isSuccess,
  onFinish,
  children,
  defaultRecord,
  ...rest
}: Props<T>) => {
  const [form] = AntForm.useForm<T>();
  const dispatch = useDispatch();

  const handleSubmit: FormProps<T>["onFinish"] = (values) => {
    onFinish(values);
  };

  useEffect(() => {
    form.setFieldsValue(defaultRecord);
  }, [defaultRecord, form]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(closeModal());
      form.resetFields();
    }
  }, [dispatch, form, isSuccess]);

  return (
    <AntForm form={form} layout="vertical" onFinish={handleSubmit} {...rest}>
      {children}
      <AntForm.Item className="flex items-center justify-end">
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          icon={<Iconify name="iconamoon:send-fill" />}
          className="mt-5 font-bold"
        >
          {buttonLabel}
        </Button>
      </AntForm.Item>
    </AntForm>
  );
};

const FormItem = <T extends Store>({
  name,
  label,
  rules,
  children,
  ...rest
}: ItemProps<T>) => {
  return (
    <AntForm.Item name={name as string} label={label} rules={rules} {...rest}>
      {children}
    </AntForm.Item>
  );
};

Form.Item = FormItem;

export default Form;
