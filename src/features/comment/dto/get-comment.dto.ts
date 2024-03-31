export class GetCommentDto {
  comId: Number;
  content: string;
  regAt: Date;
  isMod: boolean;
  authorId: number;
  authorName: string;
}
