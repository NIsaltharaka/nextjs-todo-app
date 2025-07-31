import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(req, context) {
  const id = context.params.id
  const body = await req.json()

  const updated = await prisma.todo.update({
    where: { id },
    data: {
      completed: body.completed,
      title: body.title
    }
  })

  return NextResponse.json(updated)
}

export async function DELETE(req, context) {
  const id = context.params.id

  const deleted = await prisma.todo.delete({
    where: { id }
  })

  return NextResponse.json(deleted)
}
