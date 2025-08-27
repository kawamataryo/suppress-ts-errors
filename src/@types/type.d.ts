type CommentType = 1 | 2;

type DefaultOptions = {
  tsconfigPath: string;
  commentType: CommentType;
  errorCode: boolean;
  text?: boolean;
  glob?: string;
  message?: string;
};
