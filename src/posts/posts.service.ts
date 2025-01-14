import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { RequestWithUser } from '~/common/types/extended-interfaces';
import { UpdatePostDto } from './dto/update-post.dto';
import { errors } from '~/common/util/error-messages';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity, 'DbConnection')
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  addPost(createPostDto: CreatePostDto, user: RequestWithUser['user']) {
    const post = this.postRepository.create({ ...createPostDto, user });
    return this.postRepository.save(post);
  }

  findAll() {
    return this.postRepository.find({ relations: ['user', 'comments'] });
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto, user: RequestWithUser['user']) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new BadRequestException(errors.post.not_found);
    }
    if (post.user.id !== user.id) {
      throw new BadRequestException(errors.post.unauthorized_action);
    }
    return this.postRepository.update(id, updatePostDto);
  }

  findOne(id: string) {
    return this.postRepository.findOne({ where: { id }, relations: ['user'] });
  }
}
