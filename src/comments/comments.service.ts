import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './entities/comment.entity';
import { RequestWithUser } from '~/common/types/extended-interfaces';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostsService } from '~/posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity, 'DbConnection')
    private readonly commentRepository: Repository<CommentEntity>,
    private readonly postsService: PostsService,
  ) {}

  async writeComment(createCommentDto: CreateCommentDto, user: RequestWithUser['user'], id: string) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException('Post introuvable.');
    }

    const newComment = this.commentRepository.create({
      ...createCommentDto,
      user,
      post,
    });

    return this.commentRepository.save(newComment);
  }

  findAllComments() {
    return this.commentRepository.find({ relations: ['user', 'post'] });
  }

  findOne(id: string) {
    return this.commentRepository.findOne({ where: { id } });
  }

  async deleteComment(id: string) {
    const comment = await this.findOne(id);
    if (!comment) {
      throw new NotFoundException('Commentaire introuvable.');
    }
    await this.commentRepository.delete({ id });
    return { message: 'success' };
  }

  async updateComment(id: string, updateCommentDto: CreateCommentDto, user: RequestWithUser['user']) {
    const comment = await this.findOne(id);
    if (!comment) {
      throw new NotFoundException('Commentaire introuvable.');
    }
    if (!(comment.user.id === user.id)) {
      throw new NotFoundException('Vous ne pouvez pas modifier ce commentaire.');
    }

    comment.content = updateCommentDto.content;
    await this.commentRepository.save(comment);

    return comment;
  }
}
