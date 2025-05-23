"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users } from "lucide-react"
import Link from "next/link"
import type { ProjectCreation } from "@/types/chronon-economy"

interface ProjectCreationsListProps {
  projects: ProjectCreation[]
}

export function ProjectCreationsList({ projects }: ProjectCreationsListProps) {
  const sortedProjects = [...projects].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Your created projects and issued χ-tokens</CardDescription>
          </div>
          <Button asChild>
            <Link href="/economy/projects/create">New Project</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No projects found</p>
            <Button className="mt-4" asChild>
              <Link href="/economy/projects/create">Create Your First Project</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedProjects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(project.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        {project.teamMembers} team members
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-green-600">+{project.chrononsIssued} χ</span>
                    <p className="text-sm text-muted-foreground mt-1">1 χ per team member</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Total Issued: <span className="font-bold">{projects.reduce((sum, p) => sum + p.chrononsIssued, 0)} χ</span>
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/economy/projects/history">View Full History</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
