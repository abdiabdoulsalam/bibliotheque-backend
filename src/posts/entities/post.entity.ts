import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommentEntity } from '~/comments/entities/comment.entity';
import { UserEntity } from '~/users/entities/user.entity';

@Entity({ name: 'posts' })
export class PostEntity {
  @ApiProperty({
    description: 'Identifiant unique du post',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ApiProperty({
    description: 'Titre du post',
    example: 'Mon premier post',
  })
  @Column({ type: 'varchar', length: 254, nullable: false })
  title: string;

  @ApiProperty({
    description: 'Contenu du post',
    example: 'Voici le contenu de mon premier post...',
  })
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiProperty({
    description: "URL de l'image associée au post",
    example: 'https://example.com/image.jpg',
  })
  @Column({ type: 'varchar', length: 2083, nullable: true })
  image: string | null;

  @ApiProperty({
    description: 'Auteur du post',
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, (user) => user.posts, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ApiProperty({
    description: 'Liste des commentaires associés au post',
    type: () => [CommentEntity],
    isArray: true,
  })
  @OneToMany(() => CommentEntity, (comment) => comment.post, {
    cascade: true,
  })
  comments: CommentEntity[];

  @ApiProperty({
    description: 'Date de création du post',
    example: '2025-01-01T12:34:56.000Z',
  })
  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  readonly created_at: Date;

  @ApiProperty({
    description: 'Date de la dernière mise à jour du post',
    example: '2025-01-05T15:42:30.000Z',
  })
  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  readonly updated_at: Date;
}
