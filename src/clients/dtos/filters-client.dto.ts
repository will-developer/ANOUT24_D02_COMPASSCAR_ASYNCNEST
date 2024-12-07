import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString, IsInt } from "class-validator";

export class ClientFiltersDto {
	@ApiProperty({
		required: false,
		type: Number,
		description: "Page number",
	})
	@IsOptional()
	@IsInt()
	@Transform(({ value }) => parseInt(value, 10))
	page: number = 1;

	@ApiProperty({
		required: false,
		type: Number,
		description: "Items per page",
	})
	@IsOptional()
	@IsInt()
	@Transform(({ value }) => parseInt(value, 10))
	perPage: number = 10;

	@ApiProperty({
		required: false,
		type: String,
		description: "Client's name",
	})
	@IsOptional()
	@IsString()
	name?: string;

	@ApiProperty({
		required: false,
		type: String,
		description: "Client's CPF",
	})
	@IsOptional()
	@IsString()
	cpf?: string;

	@ApiProperty({
		required: false,
		type: String,
		description: "Client's email",
	})
	@IsOptional()
	@IsString()
	email?: string;

	@ApiProperty({
		required: false,
		type: String,
		description: "Client's status",
	})
	@IsOptional()
	@IsString()
	status?: string;
}
