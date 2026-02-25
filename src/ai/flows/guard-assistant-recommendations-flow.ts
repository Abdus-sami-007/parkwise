'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating actionable recommendations
 * and alerts for parking guards based on real-time parking events and booking details.
 *
 * - guardAssistantRecommendations - A function to get AI-powered recommendations for guards.
 * - GuardAssistantRecommendationsInput - The input type for the guardAssistantRecommendations function.
 * - GuardAssistantRecommendationsOutput - The return type for the guardAssistantRecommendations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GuardAssistantRecommendationsInputSchema = z.object({
  parkingLandId: z.string().describe('The ID of the parking land.'),
  currentSlotStatuses: z.array(
    z.object({
      slotNumber: z.string().describe('The identifier for the parking slot.'),
      status: z.enum(['available', 'booked', 'occupied']).describe('The current status of the parking slot.'),
    })
  ).describe('A list of current parking slot statuses.'),
  activeBookings: z.array(
    z.object({
      slotNumber: z.string().describe('The slot number for the booking.'),
      vehiclePlate: z.string().optional().describe('The license plate of the vehicle, if available.'),
      bookedBy: z.string().describe('The name or ID of the user who booked the slot.'),
      expectedArrivalTime: z.string().optional().describe('The expected arrival time of the vehicle in ISO 8601 format.'),
      expectedDepartureTime: z.string().optional().describe('The expected departure time of the vehicle in ISO 8601 format.'),
    })
  ).describe('A list of active and upcoming booking details.'),
  recentEvents: z.string().describe('A summary of recent significant events or observations in the parking area (e.g., "Vehicle ABC-123 just departed from slot A5", "Customer at entrance asking for directions to slot C10").'),
});

export type GuardAssistantRecommendationsInput = z.infer<typeof GuardAssistantRecommendationsInputSchema>;

const GuardAssistantRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of concise, actionable recommendations or alerts for the guard.'),
});

export type GuardAssistantRecommendationsOutput = z.infer<typeof GuardAssistantRecommendationsOutputSchema>;

export async function guardAssistantRecommendations(input: GuardAssistantRecommendationsInput): Promise<GuardAssistantRecommendationsOutput> {
  return guardAssistantRecommendationsFlow(input);
}

const guardAssistantRecommendationsPrompt = ai.definePrompt({
  name: 'guardAssistantRecommendationsPrompt',
  input: { schema: GuardAssistantRecommendationsInputSchema },
  output: { schema: GuardAssistantRecommendationsOutputSchema },
  prompt: `You are an AI assistant for a parking guard. Your task is to provide concise, actionable recommendations and alerts based on the current parking situation, active bookings, and recent events. Focus on efficient vehicle flow management and proactive customer service. Prioritize immediate actions and potential issues.

Parking Land ID: {{{parkingLandId}}}

Current Parking Slot Statuses:
{{#each currentSlotStatuses}}
- Slot: {{{slotNumber}}}, Status: {{{status}}}
{{/each}}

Active and Upcoming Bookings:
{{#each activeBookings}}
- Slot: {{{slotNumber}}}
  {{#if vehiclePlate}}Vehicle: {{{vehiclePlate}}}{{/if}}
  Booked by: {{{bookedBy}}}
  {{#if expectedArrivalTime}}Expected Arrival: {{{expectedArrivalTime}}}{{/if}}
  {{#if expectedDepartureTime}}Expected Departure: {{{expectedDepartureTime}}}{{/if}}
{{/each}}

Recent Events/Observations:
{{{recentEvents}}}

Based on the information above, provide up to 3 concise, actionable recommendations or alerts for the guard:`,
});

const guardAssistantRecommendationsFlow = ai.defineFlow(
  {
    name: 'guardAssistantRecommendationsFlow',
    inputSchema: GuardAssistantRecommendationsInputSchema,
    outputSchema: GuardAssistantRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await guardAssistantRecommendationsPrompt(input);
    return output!;
  }
);
