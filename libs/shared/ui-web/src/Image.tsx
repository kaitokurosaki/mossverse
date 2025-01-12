import { types } from "@shared/data-access";
import { Form, Card, Modal, InputNumber, Button, Input, Space } from "antd";
import styled from "styled-components";
interface StackImageProps {
  srcs: (string | null | undefined)[];
  width: number;
}
export const Stack = ({ srcs, width }: StackImageProps) => {
  const urls = srcs.filter((src) => !!src);
  if (!urls.length) return <></>;
  return (
    <div style={{ position: "relative", width, height: width }}>
      {urls.map((url, idx) => (
        <div key={idx} style={{ position: "absolute" }}>
          <img alt={`${idx}`} src={url as string} width={width} />
        </div>
      ))}
    </div>
  );
};
