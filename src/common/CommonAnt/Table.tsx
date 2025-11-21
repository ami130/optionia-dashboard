import {
  Table as AntTable,
  Button,
  TableColumnType,
  Typography,
  type TableProps,
} from "antd";
import React from "react";
import { addFilter, FilterState } from "../../app/features/filterSlice";
import { useAppDispatch, useAppSelector } from "../../app/store";

interface Props<T> extends TableProps<T> {
  rowKey: keyof T | ((record: T) => React.Key);
  total: number | undefined;
  refetch: () => void;
  columns: Array<TableColumnType<T>>;
}

const Table = <T extends object>({
  rowKey,
  total,
  refetch,
  ...rest
}: Props<T>) => {
  const { page_size, page } = useAppSelector(FilterState);

  const dispatch = useAppDispatch();

  return (
    <AntTable
      title={() => (
        <Button
          title="Refetch"
          type="link"
          size="small"
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      )}
      {...rest}
      bordered
      rowKey={rowKey}
      size="small"
      scroll={{
        x: "max-content",
        y: total && total * 13 >= 650 ? 650 : undefined,
      }}
      pagination={{
        total,
        showSizeChanger: true,
        showTotal: (total) => (
          <Typography.Text strong>
            Showing {page_size} of {total} entries
          </Typography.Text>
        ),
        current: page,
        pageSize: page_size,
        onChange: (page: number, pageSize: number) => {
          dispatch(addFilter({ name: "PAGE_SIZE", value: pageSize }));
          dispatch(addFilter({ name: "PAGE", value: page }));
        },
      }}
      // footer={() => <Typography.Text>Total Data: {total || 0}</Typography.Text>}
    />
  );
};

export default Table;
