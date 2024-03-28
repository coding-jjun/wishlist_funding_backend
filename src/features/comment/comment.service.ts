import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from 'src/entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Funding } from 'src/entities/funding.entity';
import { GetCommentDto } from './dto/get-comment.dto';
import { User } from 'src/entities/user.entity';

function convertToGetCommentDto(comment: Comment): GetCommentDto {
  const { comId, content, regAt, isMod, authorId } = comment;
  return { comId, content, regAt, isMod, authorId } as GetCommentDto;
}

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Funding) private fundingRepository: Repository<Funding>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<GetCommentDto> {
    let { fundId, authorId, content } = createCommentDto;

    const where = { fundId };
    const funding = await this.fundingRepository.find({ where })[0];
    const author = await this.userRepository.find()[0];

    let newComment: Comment = new Comment();
    newComment.funding = funding;
    newComment.fundId = fundId;
    newComment.author = author;
    newComment.authorId = authorId;
    newComment.content = content;

    await this.commentRepository.save(newComment);

    return convertToGetCommentDto(newComment);
  }

  /**
   * 연관 펀딩에 달린 모든 삭제되지 않은 댓글들을 반환한다.
   * @param fundId comId가 아닌, 펀딩Id라는 점 유의.
   * @returns Comment[]
   */
  async findMany(fundId: number): Promise<GetCommentDto[]> {
    const where = { funding: { fundId } };

    return this.commentRepository
      .find({ where })
      .then((comments) => comments.map(convertToGetCommentDto));
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
