import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from 'src/entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Funding } from 'src/entities/funding.entity';
import { GetCommentDto } from './dto/get-comment.dto';
import { User } from 'src/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

function convertToGetCommentDto(comment: Comment): GetCommentDto {
  const { comId, content, regAt, isMod, authorId, author } = comment;
  const authorName = author?.userName ?? 'ANONYMOUS';
  return new GetCommentDto(comId, content, regAt, isMod, authorId, authorName);
}

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Funding) private fundingRepository: Repository<Funding>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(
    fundUuid: string,
    createCommentDto: CreateCommentDto,
  ): Promise<GetCommentDto> {
    let { authorId, content } = createCommentDto;

    const where = { fundUuid };
    const funding = await this.fundingRepository.findOne({ where });
    if (!funding) {
      throw new HttpException('funding does not exist', HttpStatus.NOT_FOUND);
    }
    const author = await this.userRepository.findOne({
      where: { userId: authorId },
    });
    if (!author) {
      throw new HttpException('author does not exist', HttpStatus.NOT_FOUND);
    }

    const newComment = new Comment({
      funding,
      fundId: funding.fundId,
      author,
      authorId: author.userId,
      content,
    });

    await this.commentRepository.save(newComment);

    this.eventEmitter.emit('NewComment', { fundId: funding.fundId, authorId });

    return convertToGetCommentDto(newComment);
  }

  /**
   * 연관 펀딩에 달린 모든 삭제되지 않은 댓글들을 반환한다.
   * @param fundUuid
   * @returns Comment[]
   */
  async findMany(fundUuid: string): Promise<GetCommentDto[]> {
    const funding = await this.fundingRepository.findOne({
      where: { fundUuid },
      relations: {
        comments: {
          author: true,
        },
      },
      order: {
        comments: {
          regAt: 'DESC',
        },
      },
    });

    return funding.comments.map(convertToGetCommentDto);
  }

  async update(
    fundId: number,
    comId: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<GetCommentDto> {
    const { content } = updateCommentDto;

    const comment = await this.commentRepository.findOne({
      relations: { author: true },
      where: { comId, fundId },
    });
    if (!comment) {
      throw new HttpException('comment not found!', HttpStatus.NOT_FOUND);
    }
    comment.content = content;
    comment.isMod = true;

    this.commentRepository.save(comment);

    return convertToGetCommentDto(comment);
  }

  /**
   * soft delete
   */
  async remove(fundId: number, comId: number) {
    const comment = await this.commentRepository.findOne({
      where: { comId, fundId },
    });
    if (!comment) {
      throw new HttpException('comment not found!', HttpStatus.NOT_FOUND);
    }
    comment.isDel = true;
    this.commentRepository.save(comment);

    return convertToGetCommentDto(comment);
  }
}
