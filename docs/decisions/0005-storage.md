# Storage

* Status: proposed
* Date: 2022-12-02

## Context and Problem Statement

What database should we use? Hard to determine pros and cons with such a small use case.

## Considered Options

* indexed DB
* local storage
* session storage

## Decision Outcome

Chosen option: "indexed DB", because local storage is only 5MB and session storage loses data whenever tab is closed. Relates to decision to implement as chrome web extension. Local storage does not work well with images.
