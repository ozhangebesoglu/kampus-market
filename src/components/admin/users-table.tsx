"use client";

import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { User } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border">
        <h3 className="text-lg font-semibold">Kullanıcı bulunamadı</h3>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kullanıcı</TableHead>
            <TableHead>Üniversite</TableHead>
            <TableHead>İlan Sayısı</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Kayıt Tarihi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback>
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {user.full_name}
                      {user.is_admin && (
                        <Badge variant="default" className="text-xs">
                          Admin
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.university_name || "-"}</TableCell>
              <TableCell>{user.listings_count}</TableCell>
              <TableCell>
                {user.is_banned ? (
                  <Badge variant="destructive">Engelli</Badge>
                ) : user.is_verified ? (
                  <Badge variant="default" className="bg-green-600">
                    Doğrulanmış
                  </Badge>
                ) : (
                  <Badge variant="secondary">Bekliyor</Badge>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(user.created_at), "dd MMM yyyy", {
                  locale: tr,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
