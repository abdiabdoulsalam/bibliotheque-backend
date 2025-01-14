import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from '~/posts/entities/post.entity';
import { UserEntity } from '~/users/entities/user.entity';

@Entity({ name: 'comments' }) // Correction du nom pour suivre une convention plurielle
export class CommentEntity {
  @ApiProperty({
    description: 'Identifiant unique du commentaire',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ApiProperty({
    description: 'Contenu du commentaire',
    example: 'Voici le contenu de mon commentaire...',
  })
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiProperty({
    description: 'Auteur du commentaire',
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, (user) => user.comment, { eager: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ApiProperty({
    description: 'Post associé au commentaire',
    type: () => PostEntity,
  })
  @ManyToOne(() => PostEntity, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: PostEntity;

  @ApiProperty({
    description: 'Date de création du commentaire',
    example: '2016-10-19 13:24:51.000000',
  })
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  readonly created_at: Date;

  @ApiProperty({
    description: 'Date de la dernière mise à jour du commentaire',
    example: '2016-10-19 13:24:51.000000',
  })
  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  readonly updated_at: Date;
}
