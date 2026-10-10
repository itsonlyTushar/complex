"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { CheckCircle2, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/toast";

interface FormData {
  fullName: string;
  email: string;
  subject: string;
  phone: string;
  message: string;
}

const INITIAL_FORM: FormData = {
  fullName: "",
  email: "",
  subject: "",
  phone: "",
  message: "",
};

const EMAILJS_SERVICE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
  process.env.NEXT_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
  process.env.NEXT_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ||
  process.env.NEXT_EMAILJS_PUBLIC_KEY;

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      toast.error("Email service is not configured. Please check your environment variables.");
      return;
    }

    setIsSubmitting(true);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: formData.fullName,
          from_name: formData.fullName,
          fullName: formData.fullName,
          email: formData.email,
          from_email: formData.email,
          reply_to: formData.email,
          phone: formData.phone || "Not provided",
          subject: formData.subject || "Contact Form Inquiry",
          message: formData.message,
        },
        EMAILJS_PUBLIC_KEY,
      );

      setIsSubmitted(true);
      toast.success("Message sent successfully! Our team will respond shortly.");
    } catch (error) {
      console.error("Failed to send email via EmailJS:", error);
      toast.error("Failed to send message. Please try again or reach out directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 sm:p-12 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-state-ready/10 text-state-ready">
          <CheckCircle2 className="size-7" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">
          Message received
        </h3>
        <p className="mt-2 max-w-md text-caption text-fg-secondary">
          Thank you, <span className="font-medium text-foreground">{formData.fullName}</span>. We have received your message
          {formData.subject ? (
            <> regarding <span className="font-medium text-foreground">"{formData.subject}"</span></>
          ) : null}
          . We will get back to you at{" "}
          <span className="font-mono text-foreground">{formData.email}</span> within 1 business day.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" onClick={handleReset}>
            Send another message
          </Button>
          <Button asChild>
            <a href="mailto:support@complexapp.food">Direct email</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
      noValidate
    >
      <div className="border-b border-border pb-5">
        <h3 className="text-xl font-semibold tracking-tight text-foreground">
          Send us a message
        </h3>
        <p className="mt-1 text-caption text-fg-secondary">
          Fill out the form below and our team will get back to you as soon as possible.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="full-name" className="text-caption font-medium text-foreground">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="full-name"
              type="text"
              placeholder="e.g. Maya Chen"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-caption font-medium text-foreground">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="maya@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-caption font-medium text-foreground">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject" className="text-caption font-medium text-foreground">
              Subject
            </Label>
            <Input
              id="subject"
              type="text"
              placeholder="e.g. Food hall table ordering inquiry"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="message" className="text-caption font-medium text-foreground">
            Message <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="message"
            rows={5}
            placeholder="Tell us what you're looking for or how we can help..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="min-h-[130px]"
            required
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Sending message...
              </>
            ) : (
              <>
                <Send className="mr-2 size-4" />
                Send message
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
