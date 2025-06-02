// import { z } from 'zod'
import * as v from 'valibot'

export const applicationTableName = 'applications'
export const applicationSchema = v.object({
    id: v.optional(v.number()),
    applying_date: v.optional(v.date()),
    employer: v.string(),
    webpage: v.string(),
    position: v.string(),
    contact_person: v.optional(v.string()),
    contact_person_gender: v.optional(v.string()),
    acknowledgement_date: v.optional(v.date()),
    interview_date: v.optional(v.date()),
    declination_date: v.optional(v.date()),
    acknowledged_occured: v.boolean(),
    interview_occured: v.boolean(),
    declination_occured: v.boolean(),
    contact_type_id: v.number(),
    status_id: v.number()
})

export type ApplicationSchema = v.InferOutput<typeof applicationSchema>

export type DateField = 'applying_date' | 'acknowledgement_date' | 'interview_date' | 'declination_date'
export type BooleanField = 'acknowledged_occured' | 'interview_occured' | 'declination_occured'
export type NumberField = 'contact_type_id' | 'status_id'
export type StringField = 'employer' | 'webpage' | 'position' | 'contact_person' | 'contact_person_gender'

export class Application {
    id!: number
    applying_date!: Date
    employer!: string
    webpage!: string
    position!: string
    contact_person!: string
    contact_person_gender!: string
    acknowledgement_date!: Date | null
    interview_date!: Date | null
    declination_date!: Date | null
    acknowledged_occured!: boolean
    interview_occured!: boolean
    declination_occured!: boolean
    contact_type_id!: number
    status_id!: number

    private getDate(input: Date | string): Date  {
        if (typeof input === 'string') {
            return new Date(input)
        } else {
            return input
        }
    }

    constructor(data: any | null | undefined) {
        // Convert any string dates to Date objects in the input data
        const processedData = data ? {
            ...data,
            applying_date: data.applying_date ? this.getDate(data.applying_date) : undefined,
            acknowledgement_date: data.acknowledgement_date ? this.getDate(data.acknowledgement_date) : undefined,
            interview_date: data.interview_date ? this.getDate(data.interview_date) : undefined,
            declination_date: data.declination_date ? this.getDate(data.declination_date) : undefined,
        } : {}

        // assign processed data
        // Object.assign(this, processedData)
        // Parse with Valibot schema (which now includes defaults)
        const result = v.safeParse(applicationSchema, processedData)
        if (!result.success) {
            throw new Error(`Invalid application data: ${result.issues}`)
        }
        // Assign validated data
        Object.assign(this, result)
    }
}
