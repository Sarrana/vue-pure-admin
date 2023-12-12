import type { FORMITEMTYPE } from "@/constants/constant";

export interface VideoType {
  id: number;
  title: string;
  description: string;
  cover: string;
  preVideoUrl: string;
  fullVideoUrl: string;
  tags: Array<string>;
  isRecommend: boolean;
  status: boolean;
  create_time: string;
}

export interface VideoListQueryType {
  title: string;
  tags: Array<string>;
  statue: boolean;
  createStartTime: string;
  createEndTime: string;
}

export interface SelOptionType {
  id?: number;
  label: string;
  value: number | string;
}

export interface SearchFormItem {
  label?: string;
  type?: FORMITEMTYPE;
  name?: string;
  placeholder?: string;
  width?: string;
  prop?: string;
  rules?: Array<any>;
  clearable?: boolean;
  selOptions?: SelOptionType[];
  inputType?: string; // 原生input的类型，例如：number
  isDisabled?: boolean; // 是否禁用
  valueFormat?: string; // 日期选择器的绑定值的格式，仅时间日期选择器使用
  accept?: string; // 接收的文件格式，仅上传适用
  shortcuts?: []; // 快捷选项，仅时间日期选择器使用
  isShow?: boolean; // 是否显示
  onSelChange?: Function; // select 改变时的回调
}

export interface UpdateFormItem {
  label?: string;
  type: FORMITEMTYPE;
  name?: string;
  placeholder?: string;
  width?: string;
  prop?: string;
  rules?: Array<any>;
  clearable?: boolean;
  selOptions?: SelOptionType[];
  isShow?: boolean; // 是否显示
}
