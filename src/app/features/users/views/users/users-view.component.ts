import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { UserItem } from '../../models/user.types';

@Component({
  selector: 'app-users-view',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, BadgeComponent, ButtonComponent, InputComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-black tracking-tight text-foreground">
            User Management
          </h2>
          <p class="text-xs text-muted-foreground mt-0.5">
            Directory of registered accounts, RBAC memberships, and status
          </p>
        </div>

        <app-button variant="primary" size="md">
          Invite Member
        </app-button>
      </div>

      <app-card className="p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 class="text-lg font-bold text-foreground">Active Directory</h3>
          <div class="w-full sm:w-64">
            <app-input
              placeholder="Search by name, email..."
              [(ngModel)]="searchQuery"
            />
          </div>
        </div>

        <div class="overflow-x-auto rounded-lg border border-border">
          <table class="w-full text-sm text-left">
            <thead class="bg-muted/40 text-xs uppercase text-muted-foreground border-b border-border">
              <tr>
                <th class="p-3">User</th>
                <th class="p-3">Role</th>
                <th class="p-3">Status</th>
                <th class="p-3">Joined</th>
                <th class="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (user of filteredUsers(); track user.id) {
                <tr class="border-b border-border hover:bg-muted/20 transition-colors">
                  <td class="p-3">
                    <div class="flex items-center gap-3">
                      <div class="h-8 w-8 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center">
                        {{ user.name.charAt(0) }}
                      </div>
                      <div>
                        <div class="font-semibold">{{ user.name }}</div>
                        <div class="text-xs text-muted-foreground">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="p-3">
                    <app-badge [variant]="user.role === 'admin' ? 'destructive' : user.role === 'manager' ? 'warning' : 'default'">
                      {{ user.role }}
                    </app-badge>
                  </td>
                  <td class="p-3">
                    <app-badge variant="success">{{ user.status }}</app-badge>
                  </td>
                  <td class="p-3 text-xs text-muted-foreground font-mono">
                    {{ user.createdAt | date:'mediumDate' }}
                  </td>
                  <td class="p-3 text-right">
                    <button
                      type="button"
                      class="text-xs font-semibold text-primary hover:underline"
                      (click)="toggleRole(user)"
                    >
                      Toggle Role
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </app-card>
    </div>
  `
})
export class UsersViewComponent {
  private readonly usersService = inject(UsersService);

  readonly usersQuery = this.usersService.getUsersQuery();
  readonly updateRoleMutation = this.usersService.updateRoleMutation();

  searchQuery = '';

  readonly filteredUsers = computed(() => {
    const list = this.usersQuery.data() || [];
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return list;
    return list.filter((u: UserItem) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.includes(q));
  });

  toggleRole(user: UserItem): void {
    const nextRole = user.role === 'admin' ? 'member' : 'admin';
    this.updateRoleMutation.mutate({ userId: user.id, role: nextRole });
  }
}
