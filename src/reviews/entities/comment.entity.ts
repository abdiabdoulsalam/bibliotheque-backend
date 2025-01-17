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
import { BookEntity } from '~/Books/entities/books.entity';
import { UserEntity } from '~/users/entities/user.entity';

@Entity({ name: 'comments' })
export class ReviewsEntity {
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
  @ManyToOne(() => UserEntity, (user) => user.reviews, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ApiProperty({
    description: 'Book associé au commentaire',
    type: () => BookEntity,
  })
  @ManyToOne(() => BookEntity, (book) => book.reviews, { onDelete: 'CASCADE' }) // "comments" au pluriel
  @JoinColumn({ name: 'book_id', referencedColumnName: 'id' })
  book: BookEntity;

  @ApiProperty({
    description: 'Date de création du commentaire',
    example: '2016-10-19T13:24:51.000Z',
  })
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  readonly created_at: Date;

  @ApiProperty({
    description: 'Date de la dernière mise à jour du commentaire',
    example: '2016-10-19T13:24:51.000Z',
  })
  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  readonly updated_at: Date;
}
